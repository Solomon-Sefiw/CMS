using FluentValidation;
using CMS.Application.Features.Employees.EmployeeActivities.Delegation.Commands.CreateDelegation;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.DelegationAssignments.Commands.CreateDelegationAssignment
{
    public class CreateDelegationValidator : AbstractValidator<CreateDelegationCommand>
    {
        private readonly IDataService _dataService;

        public CreateDelegationValidator(IDataService dataService)
        {
            _dataService = dataService;

            RuleFor(x => x.EmployeeId)
                .GreaterThan(0).WithMessage("Employee is required.");

            RuleFor(x => x.JobRoleId)
                .GreaterThan(0).WithMessage("Job Role is required.");

            RuleFor(x => x.BusinessUnitId)
                .GreaterThan(0).WithMessage("Business Unit is required.");

            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage("Start Date is required.");

            RuleFor(x => x)
                .MustAsync(NoDuplicateLatestJobRoleOrInvalidStart)
                .WithMessage("Cannot create delegation: same Job Role as latest active delegation or Start Date is before it.");

            RuleFor(x => x)
                .MustAsync(NoOverlappingDates)
                .WithMessage("This delegation overlaps with an existing active delegation for the employee.");

            RuleFor(x => x)
                .Must(EndDateAfterStart)
                .WithMessage("End Date must be after Start Date.");

            RuleFor(x => x)
                .MustAsync(IsEmployeeStatusApproved)
                .WithMessage("Employee Status must be Approved before creating a Delegation.");
        }

        private async Task<bool> NoDuplicateLatestJobRoleOrInvalidStart(CreateDelegationCommand command, CancellationToken cancellationToken)
        {
            var latestDelegation = await _dataService.Delegations
                .Where(d => d.EmployeeId == command.EmployeeId && d.IsActive &&
                            (!d.EndDate.HasValue || d.EndDate >= DateOnly.FromDateTime(DateTime.UtcNow)))
                .OrderByDescending(d => d.StartDate)
                .FirstOrDefaultAsync(cancellationToken);

            if (latestDelegation == null) return true;

            if (latestDelegation.JobRoleId == command.JobRoleId) return false;
            if (command.StartDate < latestDelegation.StartDate) return false;

            return true;
        }

        private async Task<bool> NoOverlappingDates(CreateDelegationCommand command, CancellationToken cancellationToken)
        {
            return !await _dataService.Delegations
                .AnyAsync(d =>
                    d.EmployeeId == command.EmployeeId && d.JobRoleId == command.JobRoleId &&
                    (command.EndDate ?? DateOnly.MaxValue) >= d.StartDate &&
                    (d.EndDate ?? DateOnly.MaxValue) >= command.StartDate,
                    cancellationToken);
        }

        private bool EndDateAfterStart(CreateDelegationCommand command)
        {
            if (!command.EndDate.HasValue) return true;
            return command.EndDate.Value > command.StartDate;
        }

        private async Task<bool> IsEmployeeStatusApproved(CreateDelegationCommand command, CancellationToken cancellationToken)
        {
            return await _dataService.Employees
                .AnyAsync(e =>
                    e.Id == command.EmployeeId &&
                    e.ApprovalStatus == ApprovalStatus.Approved,
                    cancellationToken);
        }
    }
}
