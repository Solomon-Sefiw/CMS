using FluentValidation;
using CMS.Application.Features.Jobs.JobCatagories.Command.ActivateDeactivateJobCatagory;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.JobCatagories.Command.ActivateDeactivateJobCategory
{
    public class DeactivateJobCategoryCommandValidator : AbstractValidator<DeactivateJobCategoryCommand>
    {
        private readonly IDataService dataService;

        public DeactivateJobCategoryCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;

            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Job Category ID is required.")
                .MustAsync(BeAnActiveJobCategory).WithMessage("The job category is either not found or already inactive.")
                .MustAsync(NotBeAssignedToJobRoles).WithMessage("Cannot deactivate a job category that is assigned to job roles.");
        }

        private async Task<bool> BeAnActiveJobCategory(int id, CancellationToken cancellationToken)
        {
            return await dataService.JobCatagories
                .AnyAsync(jc => jc.Id == id && jc.IsActive, cancellationToken);
        }

        private async Task<bool> NotBeAssignedToJobRoles(int id, CancellationToken cancellationToken)
        {
            return !await dataService.JobRoles
                .AnyAsync(jr => jr.JobCatagoryId == id, cancellationToken);
        }
    }
}
