using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.JobCatagories.Query
{
    public record GetJobCategoryCountPerApprovalStatusQuery() : IRequest<JobCategoryCountsByStatus>;

    public record JobCategoryCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);

    public class GetJobCategoryCountPerApprovalStatusHandler
    : IRequestHandler<GetJobCategoryCountPerApprovalStatusQuery, JobCategoryCountsByStatus>
    {
        private readonly IDataService context;

        public GetJobCategoryCountPerApprovalStatusHandler(IDataService context)
        {
            this.context = context;
        }

        public async Task<JobCategoryCountsByStatus> Handle(
            GetJobCategoryCountPerApprovalStatusQuery request,
            CancellationToken cancellationToken)
        {
            var approved = await context.JobCatagories
                .CountAsync(j => j.ApprovalStatus==ApprovalStatus.Approved, cancellationToken);

            var approvalRequests = await context.JobCatagories
                .CountAsync(j => j.ApprovalStatus == ApprovalStatus.Submitted, cancellationToken);

            var rejected = await context.JobCatagories
                .CountAsync(j => j.ApprovalStatus == ApprovalStatus.Rejected, cancellationToken);

            var drafts = await context.JobCatagories
                .CountAsync(j => j.ApprovalStatus == ApprovalStatus.Draft, cancellationToken);

            return new JobCategoryCountsByStatus(approved, approvalRequests, rejected, drafts);
        }
    }

}
