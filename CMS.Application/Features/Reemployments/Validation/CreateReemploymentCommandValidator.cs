using FluentValidation;
using CMS.Application.Features.Reemployments.Commands;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Reemployments.Validation
{
    public class CreateReemploymentCommandValidator : AbstractValidator<CreateReemploymentCommand>
    {
        private readonly IDataService _dataService;
        public CreateReemploymentCommandValidator(IDataService dataService)
        {
            _dataService = dataService;

            RuleFor(x => x.EmployeeId)
                .GreaterThan(0).WithMessage("Employee is required.")
                .MustAsync(EmployeeExists).WithMessage("Employee does not exist Or Not Approved.");

            RuleFor(x => x.EmployeeId)
                .MustAsync(ReEmployeeExists).WithMessage("Re-employment record exist ");

            RuleFor(x => x.ReemploymentType)
                .IsInEnum().WithMessage("Invalid reemployment type.");

            RuleFor(x => x.ReemploymentDate)
                .NotEmpty().WithMessage("Reemployment date is required.")
                .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Today))
                .WithMessage("Reemployment date cannot be in the future.");

            RuleFor(x => x.ReasonForReemployment)
                .NotEmpty().WithMessage("Reason for reemployment is required.")
                .MaximumLength(500).WithMessage("Reason must not exceed 500 characters.");
        }
        private async Task<bool> EmployeeExists(int employeeId, CancellationToken cancellationToken)
        {
            return await _dataService.Employees
                .AsNoTracking()
                .AnyAsync(e => e.Id == employeeId && e.ApprovalStatus == ApprovalStatus.Approved, cancellationToken);
        }

        private async Task<bool> ReEmployeeExists(int employeeId, CancellationToken cancellationToken)
        {
            var exist= await _dataService.Reemployments.Where(a => a.EmployeeId == employeeId).FirstOrDefaultAsync();

            if (exist == null)
                return true;
            else return false;
               
        }
    }
}
