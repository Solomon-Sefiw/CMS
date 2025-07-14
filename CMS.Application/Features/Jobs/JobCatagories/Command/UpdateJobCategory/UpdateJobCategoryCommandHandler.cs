using CMS.Domain.Enum;
using CMS.Domain;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;
using CMS.Application.Features.Jobs.JobCatagories.Command.UpdateJobCatagory;
using CMS.Application.Features.Jobs.JobCatagories.Model;

namespace CMS.Application.Features.Jobs.JobCatagories.Command.UpdateJobCatagory
{
    public class UpdateJobCategoryCommandHandler : IRequestHandler<UpdateJobCategoryCommand, int>
    {
        private readonly IDataService dataService;

        public UpdateJobCategoryCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(UpdateJobCategoryCommand request, CancellationToken cancellationToken)
        {
            // Fetch the existing category by ID
            var existingCategory = await dataService.JobCatagories
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.IsActive, cancellationToken);

            if (existingCategory == null)
                throw new KeyNotFoundException("Job category not found.");

            // Check if the category is in use and locked
            bool isLocked = existingCategory.ApprovalStatus == ApprovalStatus.Approved
                && await dataService.JobRoles.AnyAsync(j => j.JobCatagoryId == existingCategory.Id, cancellationToken);

            if (isLocked)
                throw new InvalidOperationException("Approved job category in use cannot be updated.");
   

            // Update the existing category's fields
            existingCategory.JobCategoryName = request.JobCategoryName ?? throw new ArgumentException("JobCategoryName is required.");
            existingCategory.ProbationPeriodInDays = request.ProbationPeriodInDays;
            existingCategory.ApprovalStatus = ApprovalStatus.Draft;
            existingCategory.LastModifiedAt = DateTime.UtcNow;
            existingCategory.IsActive = true;

            dataService.JobCatagories.Update(existingCategory);
            await dataService.SaveAsync(cancellationToken);

            return existingCategory.Id;
        }


    }
}
