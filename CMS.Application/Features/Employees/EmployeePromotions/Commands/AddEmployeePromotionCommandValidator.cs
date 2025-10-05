using FluentValidation;
using CMS.Application.Features.Employees.EmployeeActivities.Acting.Commands.CreateActingAssignment;
using CMS.Application.Features.Employees.Experience.Commands;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace CMS.Application.Features.Employees.EmployeePromotions.Commands
{
    public class AddEmployeePromotionCommandValidator : AbstractValidator<AddEmployeePromotionCommand>
    {
        private readonly IDataService dataService;

        public AddEmployeePromotionCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            RuleFor(x => x.PromotionEndDate)
                .Must((model, PromotionEndDate) => !PromotionEndDate.HasValue || PromotionEndDate > model.PromotionDate)
                .WithMessage("Promotion End Date must be after Promotion Date.");
            RuleFor(x => x)
                .Must(BeDifferentJobRolePromotion)
                .WithMessage("Job Role Before and After must be different.");
            RuleFor(x => x)
                .MustAsync(BeUniqueEmployeePromotion)
                .WithMessage("Duplicate promotion found for this employee on the same date and roles.");
            RuleFor(x => x)
                .MustAsync(BeAfterLastPromotionDate)
                .WithMessage("Promotion Date must be after the last promotion for this employee.");

            RuleFor(x => x)
           .MustAsync(IsEmployeeStatusApproved)
           .WithMessage("Employee Status is not Approved!");
        }

        private bool BeDifferentJobRolePromotion(AddEmployeePromotionCommand command)
        {
            return command.JobRoleBeforeId != command.JobRoleAfterId;
        }

        private async Task<bool> BeUniqueEmployeePromotion(AddEmployeePromotionCommand command, CancellationToken cancellationToken)
        {
            return !await dataService.EmployeePromotions.AnyAsync(p =>
                p.EmployeeId == command.EmployeeId &&
                p.PromotionDate == command.PromotionDate &&
                p.JobRoleBeforeId == command.JobRoleBeforeId &&
                p.JobRoleAfterId == command.JobRoleAfterId,
                cancellationToken);
        }

        private async Task<bool> BeAfterLastPromotionDate(AddEmployeePromotionCommand command, CancellationToken cancellationToken)
        {
            var lastPromotion = await dataService.EmployeePromotions
                .Where(p => p.EmployeeId == command.EmployeeId)
                .OrderByDescending(p => p.PromotionDate)
                .FirstOrDefaultAsync(cancellationToken);
            if (lastPromotion == null) return true;
            return command.PromotionDate > lastPromotion.PromotionDate;
        }

        private async Task<bool> IsEmployeeStatusApproved(AddEmployeePromotionCommand command, CancellationToken cancellationToken)
        {
            return await dataService.Employees
                  .AnyAsync(d =>
                  d.Id == command.EmployeeId &&
                  d.ApprovalStatus == ApprovalStatus.Approved,
                      cancellationToken);
        }
    }

}
