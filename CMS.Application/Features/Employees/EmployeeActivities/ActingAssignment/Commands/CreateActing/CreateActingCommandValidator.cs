using FluentValidation;
using CMS.Application.Features.Employees.EmployeeActivities.Acting.Commands.CreateActingAssignment;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Commands.CreateActing
{
    public class CreateActingCommandValidator : AbstractValidator<CreateActingCommand>
    {
        private readonly IDataService _dataService;

        public CreateActingCommandValidator(IServiceProvider serviceProvider, IDataService dataService)
        {
            _dataService = dataService;

            RuleFor(x => x.EmployeeId)
                .GreaterThan(0).WithMessage("Employee is required.");

            RuleFor(x => x.JobRoleId)
                .GreaterThan(0).WithMessage("Job Role is required.");

            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage("Start Date is required.");

            RuleFor(x => x.EndDate)
                .Must((cmd, endDate) => endDate == null || endDate >= cmd.StartDate)
                .WithMessage("End Date must be after Start Date.");

            // ✅ Ensure no overlapping Acting for same JobRole
            RuleFor(x => x)
                .MustAsync(async (cmd, cancellation) =>
                {
                    using var scope = serviceProvider.CreateScope();
                    var scopedService = scope.ServiceProvider.GetRequiredService<IDataService>();

                    var latest = await scopedService.Actings
                        .Where(a => a.EmployeeId == cmd.EmployeeId && a.JobRoleId == cmd.JobRoleId)
                        .OrderByDescending(a => a.StartDate)
                        .FirstOrDefaultAsync(cancellation);

                    if (latest == null) return true;

                    // Reject if overlap
                    return latest.EndDate.HasValue && latest.EndDate.Value < cmd.StartDate;
                })
                .WithMessage("An active or overlapping acting assignment for this job role already exists.");

            // ✅ Ensure StartDate is after latest assignment
            RuleFor(x => x)
                .MustAsync(async (cmd, cancellation) =>
                {
                    using var scope = serviceProvider.CreateScope();
                    var scopedService = scope.ServiceProvider.GetRequiredService<IDataService>();

                    var latest = await scopedService.Actings
                        .Where(a => a.EmployeeId == cmd.EmployeeId)
                        .OrderByDescending(a => a.StartDate)
                        .FirstOrDefaultAsync(cancellation);

                    if (latest == null) return true;
                    return cmd.StartDate > latest.StartDate;
                })
                .WithMessage("Start Date cannot be before or equal to the latest acting assignment's Start Date.");

            // ✅ Ensure Employee is Approved
            RuleFor(x => x)
                .MustAsync(IsEmployeeStatusApproved)
                .WithMessage("Employee Status must be Approved before creating an Acting assignment.");
        }

        private async Task<bool> IsEmployeeStatusApproved(CreateActingCommand command, CancellationToken cancellationToken)
        {
            return await _dataService.Employees
                .AnyAsync(e =>
                    e.Id == command.EmployeeId &&
                    e.ApprovalStatus == ApprovalStatus.Approved,
                    cancellationToken);
        }
    }
}
