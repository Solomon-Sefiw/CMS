using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Educations.Setups.FieldOfStudy.Queries
{
    public record FieldOfStudyCountsByStatus(int Approved, int Submitted, int Rejected, int Draft);
    public record GetFieldOfStudyCountPerStatusQuery() : IRequest<FieldOfStudyCountsByStatus>;

    public class GetSubCityCountPerStatusQueryHandler : IRequestHandler<GetFieldOfStudyCountPerStatusQuery, FieldOfStudyCountsByStatus>
    {
        private readonly IDataService _dataService;

        public GetSubCityCountPerStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<FieldOfStudyCountsByStatus> Handle(GetFieldOfStudyCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var approvedCount = await _dataService.FieldOfStudies
                .Where(r => r.ApprovalStatus == ApprovalStatus.Approved)
                .CountAsync(cancellationToken);

            var submittedCount = await _dataService.FieldOfStudies
                .Where(r => r.ApprovalStatus == ApprovalStatus.Submitted)
                .CountAsync(cancellationToken);

            var rejectedCount = await _dataService.FieldOfStudies
                .Where(r => r.ApprovalStatus == ApprovalStatus.Rejected)
                .CountAsync(cancellationToken);

            var draftCount = await _dataService.FieldOfStudies
                .Where(r => r.ApprovalStatus == ApprovalStatus.Draft)
                .CountAsync(cancellationToken);

            return new FieldOfStudyCountsByStatus(approvedCount, submittedCount, rejectedCount, draftCount);
        }
    }
}
