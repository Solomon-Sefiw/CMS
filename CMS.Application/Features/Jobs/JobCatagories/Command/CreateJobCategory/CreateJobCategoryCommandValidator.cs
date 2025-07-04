using FluentValidation;
using CMS.Application.Features.Jobs.JobCatagories.Command.UpdateJobCatagory;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.JobCatagories.Command.CreateJobCatagory
{
    public class CreateJobCategoryCommandValidator : AbstractValidator<CreateJobCategoryCommand>
    {
        private readonly IDataService _dataService;

        public CreateJobCategoryCommandValidator(IDataService dataService)
        {
            _dataService = dataService;

            RuleFor(x => x.JobCategoryName)
                .NotEmpty().WithMessage("Job Category name is required.")
                .MaximumLength(20).WithMessage("Job Category name must be 20 characters or fewer.")
                .Matches(@"^[A-Za-z]+$").WithMessage("Job Category name must contain only letters and no whitespace.")
                .MustAsync(BeUniqueName).WithMessage("Job Category name already exists.");

            RuleFor(x => x.ProbationPeriodInDays)
                .GreaterThanOrEqualTo(0).WithMessage("Probation period must be zero or a positive number.");
        }

        private async Task<bool> BeUniqueName(string jobCategoryName, CancellationToken cancellationToken)
        {
            return !await _dataService.JobCatagories
                .AnyAsync(jc => jc.JobCategoryName.ToLower() == jobCategoryName.ToLower() , cancellationToken);
        }
    }
}
