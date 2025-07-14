using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.JobCatagories.Command.ApproveJobCatagory
{
    public class ApproveJobCategoryCommandHandler : IRequestHandler<ApproveJobCategoryCommand, int>
    {
        private readonly IDataService dataService;

        public ApproveJobCategoryCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(ApproveJobCategoryCommand request, CancellationToken cancellationToken)
        {
            var jobCategory = await dataService.JobCatagories
                .FirstOrDefaultAsync(x => x.Id == request.Id && x.IsActive, cancellationToken);

            if (jobCategory == null)
                throw new KeyNotFoundException("Job category not found.");

            if (jobCategory.ApprovalStatus == ApprovalStatus.Approved)
                throw new InvalidOperationException("This job category is already approved.");

            if (jobCategory.ApprovalStatus == ApprovalStatus.Rejected)
                throw new InvalidOperationException("This job category is rejected and cannot be approved.");

            if (jobCategory.ApprovalStatus != ApprovalStatus.Submitted)
                throw new InvalidOperationException("This job category must be submitted before approval.");

            jobCategory.ApprovalStatus = ApprovalStatus.Approved;
            jobCategory.LastModifiedAt = DateTime.UtcNow;

            await dataService.SaveAsync(cancellationToken);

                   return jobCategory.Id;
        }
    }
}
