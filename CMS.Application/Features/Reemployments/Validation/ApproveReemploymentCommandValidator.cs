using FluentValidation;
using CMS.Application.Features.Employees;
using CMS.Application.Features.Reemployments.Commands;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Reemployments.Validation
{
    public class ApproveReemploymentCommandValidator : AbstractValidator<ApproveReemploymentCommand>
    {
        private readonly IDataService _dataService;
        public ApproveReemploymentCommandValidator(IDataService dataService)
        {
            _dataService = dataService;

            RuleFor(x => x.ReemploymentId)
                .GreaterThan(0).WithMessage("Reemployment ID is required.")
                .MustAsync(ReemploymentExistsAndCanBeApproved)
                .WithMessage("Reemployment record does not exist or cannot be approved.");

            When(x => x.NewEmployeeProfile != null, () =>
            {
                RuleFor(x => x.NewEmployeeProfile.FirstName)
                    .NotEmpty().WithMessage("First name is required for rehire.");

                RuleFor(x => x.NewEmployeeProfile.AmharicFirstName)
                    .NotEmpty().WithMessage("Amharic first name is required for rehire.");

                RuleFor(x => x.NewEmployeeProfile.BusinessUnitID)
                    .GreaterThan(0).WithMessage("Business Unit is required for rehire.");

                RuleFor(x => x.NewEmployeeProfile.JobId)
                    .GreaterThan(0).WithMessage("Job role is required for rehire.");

                RuleFor(x => x.NewEmployeeProfile.BirthDate)
                    .LessThanOrEqualTo(DateOnly.FromDateTime(System.DateTime.Today))
                    .WithMessage("Birth date cannot be in the future.");

                RuleFor(x => x.NewEmployeeProfile.EmployementDate)
                    .LessThanOrEqualTo(DateOnly.FromDateTime(System.DateTime.Today))
                    .WithMessage("Employment date cannot be in the future.");
            });
        }
        private async Task<bool> ReemploymentExistsAndCanBeApproved(int reemploymentId, CancellationToken token)
        {
            var reemployment = await _dataService.Reemployments
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == reemploymentId, token);

            if (reemployment == null)
                return false;

            return reemployment.ApprovalStatus == ApprovalStatus.Submitted;
        }
    }
}
