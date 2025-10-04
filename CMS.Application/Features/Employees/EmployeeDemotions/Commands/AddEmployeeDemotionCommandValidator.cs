using FluentValidation;
using CMS.Application.Features.Employees.EmployeePromotions.Commands;
using CMS.Application.Features.Employees.Experience.Commands;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace CMS.Application.Features.Employees.EmployeeDemotions.Commands
{
    public class AddEmployeeDemotionCommandValidator : AbstractValidator<AddEmployeeDemotionCommand>
    {
        private readonly IDataService dataService;

        public AddEmployeeDemotionCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
             RuleFor(x => x)
                .Must(BeDifferentJobRoleDemotion)
                .WithMessage("Job Role Before and After must be different.");
            RuleFor(x => x)
                .MustAsync(BeUniqueEmployeePromotion)
                .WithMessage("Duplicate Demotion found for this employee on the same date and roles.");
            RuleFor(x => x)
                .MustAsync(BeAfterLastPromotionDate)
                .WithMessage("Demotion Date must be after the last promotion for this employee.");
            RuleFor(x => x)
          .MustAsync(IsEmployeeStatusApproved)
          .WithMessage("Employee Status is not Approved!");
        }

        private bool BeDifferentJobRoleDemotion(AddEmployeeDemotionCommand command)
        {
            return command.JobRoleBeforeId != command.JobRoleAfterId;
        }

        private async Task<bool> BeUniqueEmployeePromotion(AddEmployeeDemotionCommand command, CancellationToken cancellationToken)
        {
            return !await dataService.EmployeeDemotions.AnyAsync(p =>
                p.EmployeeId == command.EmployeeId &&
                p.DemotionDate == command.DemotionDate &&
                p.JobRoleBeforeId == command.JobRoleBeforeId &&
                p.JobRoleAfterId == command.JobRoleAfterId,
                cancellationToken);
        }

        private async Task<bool> BeAfterLastPromotionDate(AddEmployeeDemotionCommand command, CancellationToken cancellationToken)
        {
            var lastPromotion = await dataService.EmployeeDemotions
                .Where(p => p.EmployeeId == command.EmployeeId)
                .OrderByDescending(p => p.DemotionDate)
                .FirstOrDefaultAsync(cancellationToken);
            if (lastPromotion == null) return true;
            return command.DemotionDate > lastPromotion.DemotionDate;
        }

        private async Task<bool> IsEmployeeStatusApproved(AddEmployeeDemotionCommand command, CancellationToken cancellationToken)
        {
            return await dataService.Employees
                  .AnyAsync(d =>
                  d.Id == command.EmployeeId &&
                  d.ApprovalStatus == ApprovalStatus.Approved,
                      cancellationToken);
        }
    }

}
