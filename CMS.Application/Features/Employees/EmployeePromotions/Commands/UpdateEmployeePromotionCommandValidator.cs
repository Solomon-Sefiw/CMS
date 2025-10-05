using FluentValidation;
using CMS.Application.Features.Employees.EmployeePromotions.Commands;
using CMS.Application.Features.Employees.Experience.Commands;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace CMS.Application.Features.Employees.EmployeePromotions.Commands
{
    public class UpdateEmployeePromotionCommandValidator : AbstractValidator<UpdateEmployeePromotionCommand>
    {
        private readonly IDataService dataService;
        public UpdateEmployeePromotionCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            // Promotion End Date: Must be after start date
            RuleFor(x => x.PromotionEndDate)
                .Must((model, endDate) => !endDate.HasValue || endDate > model.PromotionDate)
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
        }

        private bool BeDifferentJobRolePromotion(UpdateEmployeePromotionCommand command)
        {
            return command.JobRoleBeforeId != command.JobRoleAfterId;
        }

        private async Task<bool> BeUniqueEmployeePromotion(UpdateEmployeePromotionCommand command, CancellationToken cancellationToken)
        {
            return !await dataService.EmployeePromotions.AnyAsync(p =>
                p.EmployeeId == command.EmployeeId &&
                p.PromotionDate == command.PromotionDate &&
                p.JobRoleBeforeId == command.JobRoleBeforeId &&
                p.JobRoleAfterId == command.JobRoleAfterId && p.Id != command.Id,
                cancellationToken);
        }

        private async Task<bool> BeAfterLastPromotionDate(UpdateEmployeePromotionCommand command, CancellationToken cancellationToken)
        {
            var lastPromotion = await dataService.EmployeePromotions
                .Where(p => p.EmployeeId == command.EmployeeId && p.Id != command.Id)
                .OrderByDescending(p => p.PromotionDate)
                .FirstOrDefaultAsync(cancellationToken);
            if (lastPromotion == null) return true;
            return command.PromotionDate > lastPromotion.PromotionDate;
        }
    }
    }
