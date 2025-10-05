using FluentValidation;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Commands.UpdateActing
{
    public class UpdateActingCommandValidator : AbstractValidator<UpdateActingCommand>
    {
        private readonly IDataService _dataService;

        public UpdateActingCommandValidator(IDataService dataService)
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

            // Prevent same JobRole duplication (excluding current record)
            RuleFor(x => x)
                .MustAsync(async (cmd, cancellation) =>
                {
                    var existing = await _dataService.Actings
                        .Where(a => a.EmployeeId == cmd.EmployeeId
                                    && a.JobRoleId == cmd.JobRoleId
                                    && a.Id != cmd.Id) // exclude current record
                        .OrderByDescending(a => a.StartDate)
                        .FirstOrDefaultAsync(cancellation);

                    if (existing == null) return true;

                    // Prevent overlapping or same ongoing assignment
                    if (!existing.EndDate.HasValue || existing.EndDate.Value >= cmd.StartDate)
                        return false;

                    return true;
                })
                .WithMessage("This employee already has this Job Role assignment.");

            // Ensure update doesn't set StartDate before latest acting assignment (excluding current record)
            RuleFor(x => x)
                .MustAsync(async (cmd, cancellation) =>
                {
                    var latest = await _dataService.Actings
                        .Where(a => a.EmployeeId == cmd.EmployeeId && a.Id != cmd.Id)
                        .OrderByDescending(a => a.StartDate)
                        .FirstOrDefaultAsync(cancellation);

                    if (latest == null) return true;

                    if (cmd.StartDate < latest.StartDate)
                        return false;

                    return true;
                })
                .WithMessage("Start Date cannot be before the latest acting assignment's Start Date.");
        }
    }
}
