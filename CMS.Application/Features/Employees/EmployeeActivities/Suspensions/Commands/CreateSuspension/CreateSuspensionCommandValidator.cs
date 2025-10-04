using FluentValidation;
using CMS.Application.Features.Employees.EmployeeActivities.Resignations.Commands.CreateResignation;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Commands.CreateSuspension
{
    public class CreateSuspensionCommandValidator : AbstractValidator<CreateSuspensionCommand>
    {
        private readonly IDataService dataService;

        public CreateSuspensionCommandValidator(IDataService dataService)
        {
            this.dataService = dataService; 

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

            RuleFor(x => x)
                .MustAsync(IsEmployeeStatusApproved)
                .WithMessage("Employee Status is not Approved!");
        }

        private async Task<bool> IsEmployeeStatusApproved(CreateSuspensionCommand command, CancellationToken cancellationToken)
        {
            return await dataService.Employees
                .AnyAsync(d =>
                    d.Id == command.EmployeeId &&
                    d.ApprovalStatus == ApprovalStatus.Approved,
                    cancellationToken);
        }
    }
}
