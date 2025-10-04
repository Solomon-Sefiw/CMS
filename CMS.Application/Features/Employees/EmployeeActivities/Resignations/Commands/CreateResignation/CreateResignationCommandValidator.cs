using FluentValidation;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeActivities.Resignations.Commands.CreateResignation
{
    public class CreateResignationCommandValidator : AbstractValidator<CreateResignationCommand>
    {
        private readonly IDataService _dataService;

        public CreateResignationCommandValidator(IDataService dataService)
        {
            _dataService = dataService; 

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

            RuleFor(x => x)
                .MustAsync(IsEmployeeStatusApproved)
                .WithMessage("Employee Status is not Approved!");
        }

        private async Task<bool> IsEmployeeStatusApproved(CreateResignationCommand command, CancellationToken cancellationToken)
        {
            return await _dataService.Employees
                .AnyAsync(d =>
                    d.Id == command.EmployeeId &&
                    d.ApprovalStatus == ApprovalStatus.Approved,
                    cancellationToken);
        }
    }
}
