using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Addresses.Setups.Region.Queiries
{

    public record RegionCountsByStatus(int Approved, int Submitted, int Rejected, int Draft);
    public record GetRegionCountPerStatusQuery() : IRequest<RegionCountsByStatus>;

    public class GetRegionCountPerStatusQueryHandler : IRequestHandler<GetRegionCountPerStatusQuery, RegionCountsByStatus>
    {
        private readonly IDataService _dataService;

        public GetRegionCountPerStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<RegionCountsByStatus> Handle(GetRegionCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var approvedCount = await _dataService.Regions
                .Where(r => r.ApprovalStatus == ApprovalStatus.Approved)
                .CountAsync(cancellationToken);

            var submittedCount = await _dataService.Regions
                .Where(r => r.ApprovalStatus == ApprovalStatus.Submitted)
                .CountAsync(cancellationToken);

            var rejectedCount = await _dataService.Regions
                .Where(r => r.ApprovalStatus == ApprovalStatus.Rejected)
                .CountAsync(cancellationToken);

            var draftCount = await _dataService.Regions
                .Where(r => r.ApprovalStatus == ApprovalStatus.Draft)
                .CountAsync(cancellationToken);

            return new RegionCountsByStatus(approvedCount, submittedCount, rejectedCount, draftCount);
        }
    }
}
