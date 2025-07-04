using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Educations.Setups.EducationLevel.Queries
{

    public record EducationLevelCountsByStatus(int Approved, int Submitted, int Rejected, int Draft);
    public record GetEducationLevelCountPerStatusQuery() : IRequest<EducationLevelCountsByStatus>;

    public class GetEducationLevelCountPerStatusQueryHandler : IRequestHandler<GetEducationLevelCountPerStatusQuery, EducationLevelCountsByStatus>
    {
        private readonly IDataService _dataService;

        public GetEducationLevelCountPerStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<EducationLevelCountsByStatus> Handle(GetEducationLevelCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var approvedCount = await _dataService.EducationLevels
                .Where(r => r.ApprovalStatus == ApprovalStatus.Approved)
                .CountAsync(cancellationToken);

            var submittedCount = await _dataService.EducationLevels
                .Where(r => r.ApprovalStatus == ApprovalStatus.Submitted)
                .CountAsync(cancellationToken);

            var rejectedCount = await _dataService.EducationLevels
                .Where(r => r.ApprovalStatus == ApprovalStatus.Rejected)
                .CountAsync(cancellationToken);

            var draftCount = await _dataService.EducationLevels
                .Where(r => r.ApprovalStatus == ApprovalStatus.Draft)
                .CountAsync(cancellationToken);

            return new EducationLevelCountsByStatus(approvedCount, submittedCount, rejectedCount, draftCount);
        }
    }
}
