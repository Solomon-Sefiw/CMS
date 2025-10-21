using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Cases.CaseDetail.Chilot.Queries
{
    public record ChilotCountsByStatus(int Approved, int Submitted, int Rejected, int Draft);
    public record GetChilotCountPerStatusQuery() : IRequest<ChilotCountsByStatus>;

    public class GetChilotCountPerStatusQueryHandler : IRequestHandler<GetChilotCountPerStatusQuery, ChilotCountsByStatus>
    {
        private readonly IDataService _dataService;

        public GetChilotCountPerStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<ChilotCountsByStatus> Handle(GetChilotCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var approvedCount = await _dataService.Chillots
                .Where(r => r.ApprovalStatus == ApprovalStatus.Approved)
                .CountAsync(cancellationToken);

            var submittedCount = await _dataService.Chillots
                .Where(r => r.ApprovalStatus == ApprovalStatus.Submitted)
                .CountAsync(cancellationToken);

            var rejectedCount = await _dataService.Chillots
                .Where(r => r.ApprovalStatus == ApprovalStatus.Rejected)
                .CountAsync(cancellationToken);

            var draftCount = await _dataService.Chillots
                .Where(r => r.ApprovalStatus == ApprovalStatus.Draft)
                .CountAsync(cancellationToken);

            return new ChilotCountsByStatus(approvedCount, submittedCount, rejectedCount, draftCount);
        }
    }
}
