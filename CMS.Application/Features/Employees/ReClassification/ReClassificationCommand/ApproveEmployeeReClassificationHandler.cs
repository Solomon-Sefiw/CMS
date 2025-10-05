using Azure.Core;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static CMS.Application.Security.AuthPolicy.Employee;

namespace CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationCommand
{
    public class ApproveEmployeeReClassifictionHandler:IRequestHandler<ApproveEmployeeReClassification, int>
    {
        private readonly IDataService dataService;

        public ApproveEmployeeReClassifictionHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ApproveEmployeeReClassification command,CancellationToken cancellationToken)
        {
            var approved = await dataService.EmployeeReClassifications.FindAsync(command.Id);
            var employeeInfo= await dataService.Employees.FindAsync(command.employeeId);
            string addressCity = "";
            if (employeeInfo?.BusinessUnitID != null)
            {
                var address = await dataService.Addresses
                    .FirstOrDefaultAsync(address => address.RequestId == employeeInfo.BusinessUnitID && address.AddressType==AddressTypeEnum.BusinessUnitAddress);

                if (address != null)
                {
                    addressCity = address.City; // or whatever the correct property is
                }
            }


            if (approved == null)
                throw new Exception("ReClassification not found.");

            approved.TransactionStatus = Domain.Enum.EmployeeTransactionStatus.Approved;
            approved.Remark = approved.Remark+"\n"+command.remark;

            var jobRole = await dataService.JobRoles
                .Include(j => j.JobGrade)
                    .ThenInclude(g => g.Steps)
                .FirstOrDefaultAsync(j => j.Id == approved.JobRoleAfterId, cancellationToken);
            var employee = await dataService.Employees
        .Include(e => e.Job)
            .ThenInclude(j => j.JobRole)
                .ThenInclude(r => r.JobGrade)
                    .ThenInclude(g => g.Steps)
        .FirstOrDefaultAsync(e => e.Id == command.employeeId);

            if (employee != null)
            {
                employee.Job.JobRoleId = approved.JobRoleAfterId;
            }
            else
            {
                throw new Exception($"Employee With ID {command.employeeId} not found On On the Promotion.");
            }

            //
            if (jobRole == null)
                throw new Exception("Job role not found.");


            var beforePromotion = await dataService.EmployeePromotions
                .FirstOrDefaultAsync(x => x.PromotionEndDate == null && x.EmployeeId == approved.EmployeeId && x.Id != command.Id, cancellationToken);

            var beforeExperience = await dataService.EmployeeExperiences
                .FirstOrDefaultAsync(x => x.EndDate == null && x.EmployeeId == approved.EmployeeId, cancellationToken);
          
            var beforeDemotion = await dataService.EmployeeDemotions
                .FirstOrDefaultAsync(x => x.DemotionEndDate == null && x.EmployeeId == approved.EmployeeId && x.Id != command.Id, cancellationToken);

            if (beforeDemotion != null)
            {
                beforeDemotion.DemotionEndDate = approved.ReClassificationDate.Value.AddDays(-1);
            }

            if (beforePromotion != null)
            {
                beforePromotion.PromotionEndDate = approved.ReClassificationDate.Value.AddDays(-1);
            }

            if (beforeExperience != null)
            {
                beforeExperience.EndDate = approved.ReClassificationDate.Value.AddDays(-1);
            }

            var experience = new EmployeeExperience
            {
                EmployeeId = approved.EmployeeId,
                FirmName = "Amhara Court",
                StartDate = (DateOnly)approved.ReClassificationDate,
                EndDate = approved.ReClassificationEndDate,
                JobTitle = jobRole.RoleName,
                City = addressCity??"UnSet",
                LastSalary = jobRole.JobGrade.BaseSalary,
                ReasonForResignation = "Present on Amhara Court",
            };
            // Add to the context
            await dataService.EmployeeExperiences.AddAsync(experience, cancellationToken);
            await dataService.SaveAsync(cancellationToken);
            return approved.Id;
        }

    }
}
