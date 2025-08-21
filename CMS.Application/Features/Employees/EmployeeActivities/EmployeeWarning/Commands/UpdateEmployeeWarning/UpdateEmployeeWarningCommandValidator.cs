using FluentValidation;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeActivities.EmployeeWarning.Commands.UpdateEmployeeWarning
{
    public class UpdateEmployeeWarningCommandValidator : AbstractValidator<UpdateEmployeeWarningCommand>
    {
        private readonly IDataService _repository;

        public UpdateEmployeeWarningCommandValidator(IDataService repository)
        {
            _repository = repository;

            RuleFor(x => x.EmployeeId)
                .NotEmpty().WithMessage("Employee is required.");

            RuleFor(x => x.Percentage)
                .InclusiveBetween(0, 100).WithMessage("Not Valid Percentage");

            RuleFor(x => x.WarningDate)
                .NotEmpty().WithMessage("Date is required.");

            RuleFor(x => x.WarningStatus)
                .NotEmpty().WithMessage("Warning level is required.")
                .MustAsync(BeValidWarningLevel)
                .WithMessage("This employee already has this warning.");
        }

        private async Task<bool> BeValidWarningLevel(UpdateEmployeeWarningCommand model, WarningStatus statusId, CancellationToken token)
        {
            var warnings = await _repository.EmployeeWarnings
                .Where(x => x.EmployeeId == model.EmployeeId && x.Id != model.Id) // Exclude current record in update
                .ToListAsync(token);

            var warningLevels = warnings.Select(w => w.WarningStatus).ToHashSet();

            return statusId switch
            {
                WarningStatus.FirstLevel => !warningLevels.Contains(WarningStatus.FirstLevel),
                WarningStatus.SecondLevel => warningLevels.Contains(WarningStatus.FirstLevel) &&
                                             !warningLevels.Contains(WarningStatus.SecondLevel),
                WarningStatus.ThirdLevel => warningLevels.Contains(WarningStatus.FirstLevel) &&
                                            warningLevels.Contains(WarningStatus.SecondLevel) &&
                                            !warningLevels.Contains(WarningStatus.ThirdLevel),
                _ => false
            };
        }
    }
}
