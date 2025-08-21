using FluentValidation;
using CMS.Application.Features.Reemployments.Commands;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Reemployments.Validation
{
    public class UpdateReemploymentCommandValidator : AbstractValidator<UpdateReemploymentCommand>
    {
        private readonly IDataService _dataService;
        public UpdateReemploymentCommandValidator(IDataService dataService)
        {
            _dataService = dataService;

            RuleFor(x => x.ReemploymentId)
                .GreaterThan(0).WithMessage("Reemployment ID is required.")
                .MustAsync(ReemploymentExists).WithMessage("Reemployment record does not exist.")
                .DependentRules(() =>
                {
                    RuleFor(x => x.ReemploymentId)
                        .MustAsync(HasUpdatableStatus)
                        .WithMessage("Only Draft or Rejected reemployment requests can be updated.");
                });

            RuleFor(x => x.ReemploymentType)
                .IsInEnum().WithMessage("Invalid reemployment type.");

            RuleFor(x => x.ReemploymentDate)
                .NotEmpty().WithMessage("Reemployment date is required.")
                .LessThanOrEqualTo(DateOnly.FromDateTime(System.DateTime.Today))
                .WithMessage("Reemployment date cannot be in the future.");

            RuleFor(x => x.ReasonForReemployment)
                .NotEmpty().WithMessage("Reason for reemployment is required.")
                .MaximumLength(500).WithMessage("Reason must not exceed 500 characters.");

        }
        private async Task<bool> ReemploymentExists(int reemploymentId, CancellationToken token)
        {
            return await _dataService.Reemployments
                .AsNoTracking()
                .AnyAsync(r => r.Id == reemploymentId, token);
        }
        private async Task<bool> HasUpdatableStatus(int reemploymentId, CancellationToken token)
        {
            var reemployment = await _dataService.Reemployments
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == reemploymentId, token);

            if (reemployment == null) return false;

            return reemployment.ApprovalStatus == ApprovalStatus.Draft ||
                   reemployment.ApprovalStatus == ApprovalStatus.Rejected;
        }
    }
}
