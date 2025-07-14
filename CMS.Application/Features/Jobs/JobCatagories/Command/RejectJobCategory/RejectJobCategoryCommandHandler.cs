using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.JobCatagories.Command.RejectJobCatagory
{
    public class RejectJobCategoryCommandHandler:IRequestHandler<RejectJobCategoryCommand, int>
    {
        private readonly IDataService dataService;
        public RejectJobCategoryCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(RejectJobCategoryCommand request, CancellationToken cancellationToken)
        {
            var jobCategory = await dataService.JobCatagories
    .FirstOrDefaultAsync(x => x.Id == request.Id && x.IsActive, cancellationToken);

            if (jobCategory == null)
                throw new KeyNotFoundException("Job category not found.");

            if (jobCategory.ApprovalStatus == ApprovalStatus.Approved)
                throw new InvalidOperationException("Approved job category cannot be rejected.");

            if (jobCategory.ApprovalStatus == ApprovalStatus.Rejected)
                throw new InvalidOperationException("Job category is already rejected.");

            jobCategory.ApprovalStatus = ApprovalStatus.Rejected;

            jobCategory.LastModifiedAt = DateTime.UtcNow;

            await dataService.SaveAsync(cancellationToken);

            return jobCategory.Id;
        }
    }
}
