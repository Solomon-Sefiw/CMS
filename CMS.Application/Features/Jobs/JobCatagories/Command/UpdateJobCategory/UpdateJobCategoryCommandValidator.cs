using FluentValidation;
using CMS.Application.Features.Jobs.JobCatagories.Command.UpdateJobCatagory;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.JobCatagories.Command.UpdateJobCategory
{
    public class UpdateJobCategoryCommandValidator : AbstractValidator<UpdateJobCategoryCommand>
    {
        private readonly IDataService _dataService;

        public UpdateJobCategoryCommandValidator(IDataService dataService)
        {
            _dataService = dataService;

            RuleFor(x => x.JobCategoryName)
                .NotEmpty().WithMessage("Job Category name is required.")
                .MaximumLength(20).WithMessage("Job Category name must be 20 characters or fewer.")
                .Matches(@"^[A-Za-z]+$").WithMessage("Job Category name must contain only letters and no whitespace.")
                .MustAsync(BeUniqueName).WithMessage("Job Category name already exists.");

            RuleFor(x => x.ProbationPeriodInDays)
                .GreaterThanOrEqualTo(0).WithMessage("Probation period must be zero or a positive number.");

            // Add this rule for "no changes made"
            RuleFor(command => command)
                .MustAsync(NoChangesMade)
                .WithMessage("No changes were made to the job category.");
        }

        private async Task<bool> BeUniqueName(UpdateJobCategoryCommand command, string jobCategoryName, CancellationToken cancellationToken)
        {
            return !await _dataService.JobCatagories
                .AnyAsync(jc =>
                    jc.Id != command.Id && // Exclude current record
                    jc.JobCategoryName.ToLower() == jobCategoryName.ToLower(),
                    cancellationToken);
        }

        private async Task<bool> NoChangesMade(UpdateJobCategoryCommand command, CancellationToken cancellationToken)
        {
            var existingCategory = await _dataService.JobCatagories
                .FirstOrDefaultAsync(jc => jc.Id == command.Id && jc.IsActive, cancellationToken);

            if (existingCategory == null)
            {
                // If the entity doesn't exist, validation fails elsewhere (like the handler)
                return true;
            }

            bool isUnchanged =
                existingCategory.JobCategoryName.Equals(command.JobCategoryName, System.StringComparison.OrdinalIgnoreCase) &&
                existingCategory.ProbationPeriodInDays == command.ProbationPeriodInDays;

            // Return false if unchanged to trigger validation error
            return !isUnchanged;
        }
    }
}
