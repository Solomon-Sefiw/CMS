using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Queiries
{
    public record JobRoleCatagoryCountsByStatus(int Approved, int Submitted, int Rejected, int Draft);
    public record GetJobRoleCatagoryCountPerStatusQuery() : IRequest<JobRoleCatagoryCountsByStatus>;

    public class GetRegionCountPerStatusQueryHandler : IRequestHandler<GetJobRoleCatagoryCountPerStatusQuery, JobRoleCatagoryCountsByStatus>
    {
        private readonly IDataService _dataService;

        public GetRegionCountPerStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<JobRoleCatagoryCountsByStatus> Handle(GetJobRoleCatagoryCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var approvedCount = await _dataService.JobRoleCatagories
                .Where(r => r.ApprovalStatus == ApprovalStatus.Approved)
                .CountAsync(cancellationToken);

            var submittedCount = await _dataService.JobRoleCatagories
                .Where(r => r.ApprovalStatus == ApprovalStatus.Submitted)
                .CountAsync(cancellationToken);

            var rejectedCount = await _dataService.JobRoleCatagories
                .Where(r => r.ApprovalStatus == ApprovalStatus.Rejected)
                .CountAsync(cancellationToken);

            var draftCount = await _dataService.JobRoleCatagories
                .Where(r => r.ApprovalStatus == ApprovalStatus.Draft)
                .CountAsync(cancellationToken);

            return new JobRoleCatagoryCountsByStatus(approvedCount, submittedCount, rejectedCount, draftCount);
        }
    }
}
