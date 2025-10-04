using FluentValidation;
using CMS.Application.Features.Employees.EmployeeDemotions.Commands;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeActivities.EmployeeWarning.Commands.CreateEmployeeWarning
{
    public class CreateEmployeeWarningValidator : AbstractValidator<CreateEmployeeWarningCommand>
    {
        private readonly IDataService _repository;

        public CreateEmployeeWarningValidator(IDataService repository)
        {
            _repository = repository;

            RuleFor(x => x.EmployeeId)
                .NotEmpty().WithMessage("Employee is required.");

            RuleFor(x => x.Percentage)
                .InclusiveBetween(0, 100).WithMessage("Percentage must be between 0 and 100.");

            RuleFor(x => x.WarningDate)
                .NotEmpty().WithMessage("Warning date is required.");

            RuleFor(x => x.WarningStatus)
                .NotEmpty().WithMessage("Warning level is required.")
                .MustAsync(BeValidWarningLevel).WithMessage("This employee already has this warning level or previous levels are missing.");

            RuleFor(x => x)
                .MustAsync(IsEmployeeStatusApproved)
                .WithMessage("Cannot issue warning. Employee status is not Approved.");
        }

        private async Task<bool> BeValidWarningLevel(CreateEmployeeWarningCommand model, WarningStatus statusId, CancellationToken token)
        {
            // Load only statuses (better performance than full entities)
            var warningLevels = await _repository.EmployeeWarnings
                .Where(x => x.EmployeeId == model.EmployeeId)
                .Select(x => x.WarningStatus)
                .ToListAsync(token);

            return statusId switch
            {
                WarningStatus.FirstLevel => !warningLevels.Contains(WarningStatus.FirstLevel),

                WarningStatus.SecondLevel =>
                    warningLevels.Contains(WarningStatus.FirstLevel) &&
                    !warningLevels.Contains(WarningStatus.SecondLevel),

                WarningStatus.ThirdLevel =>
                    warningLevels.Contains(WarningStatus.FirstLevel) &&
                    warningLevels.Contains(WarningStatus.SecondLevel) &&
                    !warningLevels.Contains(WarningStatus.ThirdLevel),

                _ => false
            };
        }

        private async Task<bool> IsEmployeeStatusApproved(CreateEmployeeWarningCommand command, CancellationToken cancellationToken)
        {
            return await _repository.Employees
                .AnyAsync(e => e.Id == command.EmployeeId &&
                               e.ApprovalStatus == ApprovalStatus.Approved,
                          cancellationToken);
        }
    }
}
