using FluentValidation;
using CMS.Application.Features.Employees.EmployeePromotions.Commands;
using CMS.Application.Features.Employees.Experience.Commands;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace CMS.Application.Features.Employees.EmployeeDemotions.Commands
{
    public class UpdateEmployeeDemotionCommandValidator : AbstractValidator<UpdateEmployeeDemotionCommand>
    {
        private readonly IDataService dataService;
        public UpdateEmployeeDemotionCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            // Promotion End Date: Must be after start date
            RuleFor(x => x.DemotionEndDate)
                .Must((model, endDate) => !endDate.HasValue || endDate > model.DemotionDate)
                .WithMessage("Demotion End Date must be after Demotion Date.");
            RuleFor(x => x)
                .Must(BeDifferentEmployeeDemotion)
                .WithMessage("Job Role Before and After must be different.");
            RuleFor(x => x)
                .MustAsync(BeUniqueEmployeeDemotion)
                .WithMessage("Duplicate Demotion found for this employee on the same date and roles.");
            RuleFor(x => x)
                .MustAsync(BeAfterLastDemotionDate)
                .WithMessage("Demotion Date must be after the last promotion for this employee.");
        }

        private bool BeDifferentEmployeeDemotion(UpdateEmployeeDemotionCommand command)
        {
            return command.JobRoleBeforeId != command.JobRoleAfterId;
        }

        private async Task<bool> BeUniqueEmployeeDemotion(UpdateEmployeeDemotionCommand command, CancellationToken cancellationToken)
        {
            return !await dataService.EmployeeDemotions.AnyAsync(p =>
                p.EmployeeId == command.EmployeeId &&
                p.DemotionDate == command.DemotionDate &&
                p.JobRoleBeforeId == command.JobRoleBeforeId &&
                p.JobRoleAfterId == command.JobRoleAfterId && p.Id != command.Id,
                cancellationToken);
        }

        private async Task<bool> BeAfterLastDemotionDate(UpdateEmployeeDemotionCommand command, CancellationToken cancellationToken)
        {
            var lastDemotion = await dataService.EmployeeDemotions
                .Where(p => p.EmployeeId == command.EmployeeId && p.Id != command.Id)
                .OrderByDescending(p => p.DemotionDate)
                .FirstOrDefaultAsync(cancellationToken);
            if (lastDemotion == null) return true;
            return command.DemotionDate > lastDemotion.DemotionDate;
        }
    }
    }
