using FluentValidation;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Commands.UpdateDelegation
{
    public class UpdateDelegationCommandsValidator : AbstractValidator<UpdateDelegationCommands>
    {
        private readonly IDataService _dataService;

        public UpdateDelegationCommandsValidator(IDataService dataService)
        {
            _dataService = dataService;

            RuleFor(x => x.EmployeeId)
                .GreaterThan(0).WithMessage("Employee is required.");

            RuleFor(x => x.JobRoleId)
                .GreaterThan(0).WithMessage("Job Role is required.");

            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage("Start Date is required.");

            RuleFor(x => x.BusinessUnitId)
                .GreaterThan(0).WithMessage("Business Unit is required.");

            RuleFor(x => x)
                .MustAsync(NoDuplicateLatestJobRoleOrInvalidStart)
                .WithMessage("Cannot update delegation: same Job Role as latest active delegation or Start Date is before it.");

            RuleFor(x => x)
                .MustAsync(NoOverlappingDates)
                .WithMessage("This delegation overlaps with an existing active delegation for the employee.");

            RuleFor(x => x)
                .Must(EndDateAfterStart)
                .WithMessage("End Date must be after Start Date.");
        }

        private async Task<bool> NoDuplicateLatestJobRoleOrInvalidStart(UpdateDelegationCommands command, CancellationToken cancellationToken)
        {
            var latestDelegation = await _dataService.Delegations
                .Where(d => d.EmployeeId == command.EmployeeId
                            && d.IsActive == true
                            && (!d.EndDate.HasValue || d.EndDate >= DateOnly.FromDateTime(DateTime.UtcNow))
                            && d.Id != command.Id) // exclude current record
                .OrderByDescending(d => d.StartDate)
                .FirstOrDefaultAsync(cancellationToken);

            if (latestDelegation == null) return true;

            if (latestDelegation.JobRoleId == command.JobRoleId) return false;

            if (command.StartDate < latestDelegation.StartDate) return false;

            return true;
        }

        private async Task<bool> NoOverlappingDates(UpdateDelegationCommands command, CancellationToken cancellationToken)
        {
            return !await _dataService.Delegations
                .AnyAsync(d =>
                    d.EmployeeId == command.EmployeeId &&
                    d.Id != command.Id && // exclude current record
                    (command.EndDate ?? DateOnly.MaxValue) >= d.StartDate &&
                    (d.EndDate ?? DateOnly.MaxValue) >= command.StartDate,
                    cancellationToken);
        }

        private bool EndDateAfterStart(UpdateDelegationCommands command)
        {
            if (!command.EndDate.HasValue) return true;
            return command.EndDate.Value > command.StartDate;
        }
    }
}
