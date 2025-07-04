using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Educations.Setups.Award.Queries
{
    public record AwardCountsByStatus(int Approved, int Submitted, int Rejected, int Draft);
    public record GetAwardCountPerStatusQuery() : IRequest<AwardCountsByStatus>;

    public class GetSubCityCountPerStatusQueryHandler : IRequestHandler<GetAwardCountPerStatusQuery, AwardCountsByStatus>
    {
        private readonly IDataService _dataService;

        public GetSubCityCountPerStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<AwardCountsByStatus> Handle(GetAwardCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var approvedCount = await _dataService.Awards
                .Where(r => r.ApprovalStatus == ApprovalStatus.Approved)
                .CountAsync(cancellationToken);

            var submittedCount = await _dataService.Awards
                .Where(r => r.ApprovalStatus == ApprovalStatus.Submitted)
                .CountAsync(cancellationToken);

            var rejectedCount = await _dataService.Awards
                .Where(r => r.ApprovalStatus == ApprovalStatus.Rejected)
                .CountAsync(cancellationToken);

            var draftCount = await _dataService.Awards
                .Where(r => r.ApprovalStatus == ApprovalStatus.Draft)
                .CountAsync(cancellationToken);

            return new AwardCountsByStatus(approvedCount, submittedCount, rejectedCount, draftCount);
        }
    }
}
