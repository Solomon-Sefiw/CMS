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

namespace CMS.Application.Features.Employees.SalaryIncrement.SalaryIncrementCommand
{
    public class ApproveSalaryIncrementCommandHandler : IRequestHandler<ApproveSalaryIncrementCommand, int>
    {
        private readonly IDataService dataService;

        public ApproveSalaryIncrementCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ApproveSalaryIncrementCommand command, CancellationToken cancellationToken)
        {
            var approved = await dataService.EmployeeSalaryIncrements.FindAsync(command.Id);
            var employeeInfo = await dataService.Employees.FindAsync(command.employeeId);
            string addressCity = "";
            if (employeeInfo?.BusinessUnitID != null)
            {
                var address = await dataService.Addresses
                    .FirstOrDefaultAsync(address => address.RequestId == employeeInfo.BusinessUnitID && address.AddressType == AddressTypeEnum.BusinessUnitAddress);

                if (address != null)
                {
                    addressCity = address.City; // or whatever the correct property is
                }
            }


            if (approved == null)
                throw new Exception("Salary Increment not found.");

            approved.TransactionStatus = Domain.Enum.EmployeeTransactionStatus.Approved;
            approved.Remark = approved.Remark + "\n" + command.remark;

            var jobRole = await dataService.JobRoles
                .Include(j => j.JobGrade)
                    .ThenInclude(g => g.Steps)
                .FirstOrDefaultAsync(j => j.Id == approved.JobRoleId, cancellationToken);
            var employee = await dataService.Employees
        .Include(e => e.Job)
            .ThenInclude(j => j.JobRole)
                .ThenInclude(r => r.JobGrade)
                    .ThenInclude(g => g.Steps)
        .FirstOrDefaultAsync(e => e.Id == command.employeeId);

            if (employee != null)
            {
                employee.SalaryOnGradeStepId = approved.AfterGradeSalaryStepId;
            }
            else
            {
                throw new Exception($"Employee With Id {command.employeeId} not found On On the Promotion.");
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
                beforeDemotion.AfterGradeSalaryStepId = approved.AfterGradeSalaryStepId;
            }

            if (beforePromotion != null)
            {
                beforePromotion.AfterGradeSalaryStepId = approved.AfterGradeSalaryStepId;
            }

            if (beforeExperience != null)
            {
                if (approved.AfterGradeSalaryStepId == 0)
                {
                    beforeExperience.LastSalary = approved.JobRole.JobGrade.BaseSalary;

                }
                else if (approved.AfterGradeSalaryStepId == 10)
                {
                    beforeExperience.LastSalary = (decimal)approved.JobRole.JobGrade.CeilingSalary;

                }
                else
                {
                    beforeExperience.LastSalary = approved.JobRole.JobGrade.Steps
                        .FirstOrDefault(s => s.StepNumber == approved.AfterGradeSalaryStepId)?.SalaryAmount ?? 0;

                }
            }
            var beforeSalaryIncrement = await dataService.EmployeeSalaryIncrements
                .FirstOrDefaultAsync(x => x.SalaryIncrementEndDate == null && x.EmployeeId == approved.EmployeeId && x.Id != command.Id, cancellationToken);

            if(beforeSalaryIncrement != null)
            {
                beforeSalaryIncrement.SalaryIncrementEndDate = approved.SalaryIncrementDate.AddDays(-1);
            }
            await dataService.SaveAsync(cancellationToken);

            return approved.Id;
        }

    }
}
