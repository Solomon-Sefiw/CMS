using FluentValidation;
using System;

namespace CMS.Application.Features.Employees.EmployeeActivities.Resignations.Commands.UpdateResignation
{
    public class UpdateResignationCommandValidator : AbstractValidator<UpdateResignationCommand>
    {
        public UpdateResignationCommandValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0)
                .WithMessage("Resignation ID must be a valid, positive number.");

            RuleFor(x => x.EmployeeId)
                .GreaterThan(0)
                .WithMessage("Employee ID must be a valid, positive number.");

            RuleFor(x => x.Salary)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Salary must be a positive amount.");

            RuleFor(x => x.WorkUnit)
                .NotEmpty().WithMessage("Work Unit is required.")
                .MaximumLength(255)
                .WithMessage("Work Unit cannot exceed 255 characters.");

            RuleFor(x => x.ResignationDate)
                .NotEmpty().WithMessage("Resignation Date is required.")
                .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Today))
                .WithMessage("Resignation Date cannot be in the future.");

            RuleFor(x => x.ResignationType)
                .IsInEnum()
                .WithMessage("Resignation Type is invalid.");

            RuleFor(x => x.ReasonForResignation)
                .NotEmpty().WithMessage("Reason for Resignation is required.")
                .MaximumLength(1000)
                .WithMessage("Reason for Resignation cannot exceed 1000 characters.");

            RuleFor(x => x.FinalSettlementDetails)
                .MaximumLength(1000)
                .WithMessage("Final Settlement Details cannot exceed 1000 characters.");
        }
    }
}
