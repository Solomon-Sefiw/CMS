using CMS.Application.Features.Jobs.JobCatagories.Command.CreateJobCatagory;
using CMS.Domain;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.JobCategories.Command.CreateJobCategory
{
    public class CreateJobCategoryCommandHandler : IRequestHandler<CreateJobCategoryCommand, int>
    {
        private readonly IDataService dataService;

        public CreateJobCategoryCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(CreateJobCategoryCommand request, CancellationToken cancellationToken)
        {
            // Check for existing job category with the same name (case-insensitive)
            var existingCategory = await dataService.JobCatagories
                .AsQueryable()
                .FirstOrDefaultAsync(jc => jc.JobCategoryName.ToLower() == request.JobCategoryName.ToLower(), cancellationToken);

            
            var jobCategory = new JobCatagory
            {
                JobCategoryName = request.JobCategoryName,
                ProbationPeriodInDays = request.ProbationPeriodInDays,
                ApprovalStatus = Domain.Enum.ApprovalStatus.Draft,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                LastModifiedAt = DateTime.UtcNow
            };

            dataService.JobCatagories.Add(jobCategory);
            await dataService.SaveAsync(cancellationToken);

            return jobCategory.Id;
        }
    }
}
