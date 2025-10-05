using FluentValidation;
using System;

namespace CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Commands.UpdateSuspension
{
    public class UpdateSuspensionCommandValidator : AbstractValidator<UpdateSuspensionCommand>
    {
        public UpdateSuspensionCommandValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0)
                .WithMessage("Suspension ID must be a valid, positive number.");

            RuleFor(x => x.EmployeeId)
                .GreaterThan(0)
                .WithMessage("Employee ID must be a valid, positive number.");

            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage("Start Date is required.")
                .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Today))
                .WithMessage("Start Date cannot be in the future.");

            RuleFor(x => x.EndDate)
                .GreaterThan(x => x.StartDate)
                .When(x => x.EndDate.HasValue)
                .WithMessage("End Date must be after Start Date.");

            RuleFor(x => x.Salary)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Salary must be a positive amount.");

            RuleFor(x => x.Reason)
                .IsInEnum()
                .WithMessage("Suspension reason is invalid.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.")
                .MaximumLength(1000)
                .WithMessage("Description cannot exceed 1000 characters.");

            RuleFor(x => x.ConditionsForReinstatement)
                .MaximumLength(1000)
                .WithMessage("Conditions for reinstatement cannot exceed 1000 characters.");
        }
    }
}
