using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeDemotions.Commands
{
    public class ApproveEmployeeDemotionHandler:IRequestHandler<ApproveEmployeeDemotion,int>
    {
        private readonly IDataService dataService;

        public ApproveEmployeeDemotionHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ApproveEmployeeDemotion command,CancellationToken cancellationToken)
        {
            var approved = await dataService.EmployeeDemotions.FindAsync(command.Id);

            if (approved == null)
                throw new Exception("Promotion not found.");

            approved.TransactionStatus = Domain.Enum.EmployeeTransactionStatus.Approved;
            approved.Remark = approved.Remark+"\n"+command.remark;
            var jobRole = await dataService.JobRoles
                .Include(j => j.JobGrade)
                    .ThenInclude(g => g.Steps)
                .FirstOrDefaultAsync(j => j.Id == approved.JobRoleAfterId, cancellationToken);
            // Employee Job and BussinessUnit Updation
            var employee = await dataService.Employees
        .Include(e => e.Job)
            .ThenInclude(j => j.JobRole)
                .ThenInclude(r => r.JobGrade)
                    .ThenInclude(g => g.Steps)
        .FirstOrDefaultAsync(e => e.Id == command.employeeId);

            if (employee != null)
            {
                employee.Job.JobRoleId = approved.JobRoleAfterId;
                employee.BusinessUnitID = approved.BusinessUnitAfterId;
            }
            else
            {
                throw new Exception($"Employee With ID {command.employeeId} not found On On the Promotion.");
            }
            if (jobRole == null)
                throw new Exception("Job role not found.");

            var address = await dataService.Addresses
                .Where(ad => ad.RequestId == approved.BusinessUnitAfterId && ad.AddressType == AddressTypeEnum.BusinessUnitAddress)
                .FirstOrDefaultAsync(cancellationToken);

            var beforeDemotion = await dataService.EmployeeDemotions
                .FirstOrDefaultAsync(x => x.DemotionEndDate == null && x.EmployeeId == approved.EmployeeId && x.Id != approved.Id, cancellationToken);

            var beforePromotion = await dataService.EmployeePromotions
                .FirstOrDefaultAsync(x => x.PromotionEndDate == null && x.EmployeeId == approved.EmployeeId && x.Id != approved.Id, cancellationToken);
            var beforeExperience = await dataService.EmployeeExperiences
              .FirstOrDefaultAsync(x => x.EndDate == null && x.EmployeeId == approved.EmployeeId, cancellationToken);
            //
            var beforeReClassification = await dataService.EmployeeReClassifications
           .FirstOrDefaultAsync(x => x.ReClassificationEndDate == null && x.EmployeeId == approved.EmployeeId, cancellationToken);

            if(beforeReClassification != null)
            {
                beforeReClassification.ReClassificationEndDate = approved.DemotionDate.Value.AddDays(-1);

            }
            if (beforePromotion != null)
            {
                beforePromotion.PromotionEndDate = approved.DemotionDate.Value.AddDays(-1);
            }
            if (beforeDemotion != null)
            {
                beforeDemotion.DemotionEndDate = approved.DemotionDate.Value.AddDays(-1);
            }
            if (beforeExperience != null)
            {
                beforeExperience.EndDate = approved.DemotionDate.Value.AddDays(-1);
            }

            var experience = new EmployeeExperience
            {
                EmployeeId = approved.EmployeeId,
                FirmName = "Amhara Court.",
                StartDate = (DateOnly)approved.DemotionDate,
                EndDate = approved.DemotionEndDate,
                JobTitle = jobRole.RoleName,
                City = address?.City ?? "UnSet",
                LastSalary = jobRole.JobGrade.BaseSalary,
                ReasonForResignation = "Present on Amhara Court",
            };
            await dataService.EmployeeExperiences.AddAsync(experience, cancellationToken);            //
            await dataService.SaveAsync(cancellationToken);
            return approved.Id;
        }

    }
}
