using FluentValidation;
using CMS.Application.Features.Employees.EmployeeActivities.Acting.Commands.CreateActingAssignment;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Commands.ReAssignmentActing
{
    public class ReAssignmentActingCommandValidator : AbstractValidator<CreateActingCommand>
    {
        private readonly IDataService _dataService;

        public ReAssignmentActingCommandValidator(IDataService dataService)
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

            RuleFor(x => x)
                .MustAsync(async (cmd, cancellation) =>
                {
                    var latest = await _dataService.Actings
                        .Where(a => a.EmployeeId == cmd.EmployeeId && a.JobRoleId == cmd.JobRoleId)
                        .OrderByDescending(a => a.StartDate)
                        .FirstOrDefaultAsync(cancellation);

                    if (latest == null) return true;

                    // Prevent duplicate active assignment
                    if (!latest.EndDate.HasValue || latest.EndDate.Value >= cmd.StartDate)
                        return false;

                    return true;
                })
                .WithMessage("An active or overlapping acting assignment for this job role already exists.");

            RuleFor(x => x)
                .MustAsync(async (cmd, cancellation) =>
                {
                    var latest = await _dataService.Actings
                        .Where(a => a.EmployeeId == cmd.EmployeeId)
                        .OrderByDescending(a => a.StartDate)
                        .FirstOrDefaultAsync(cancellation);

                    if (latest == null) return true;

                    // ✅ Require at least 1 day of experience
                    var minAllowedDate = latest.StartDate.AddDays(1);

                    if (cmd.StartDate < minAllowedDate)
                        return false;

                    return true;
                })
                .WithMessage("Reassignment requires at least 1 day of experience in the latest acting assignment.");
        }
    }
}
