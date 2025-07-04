using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Educations.Setups.InstitutionName.Queries
{
    public record InstitutionNameCountsByStatus(int Approved, int Submitted, int Rejected, int Draft);
    public record GetInstitutionNameCountPerStatusQuery() : IRequest<InstitutionNameCountsByStatus>;

    public class GetInstitutionNameCountPerStatusQueryHandler : IRequestHandler<GetInstitutionNameCountPerStatusQuery, InstitutionNameCountsByStatus>
    {
        private readonly IDataService _dataService;

        public GetInstitutionNameCountPerStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<InstitutionNameCountsByStatus> Handle(GetInstitutionNameCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var approvedCount = await _dataService.InstitutionNames
                .Where(r => r.ApprovalStatus == ApprovalStatus.Approved)
                .CountAsync(cancellationToken);

            var submittedCount = await _dataService.InstitutionNames
                .Where(r => r.ApprovalStatus == ApprovalStatus.Submitted)
                .CountAsync(cancellationToken);

            var rejectedCount = await _dataService.InstitutionNames
                .Where(r => r.ApprovalStatus == ApprovalStatus.Rejected)
                .CountAsync(cancellationToken);

            var draftCount = await _dataService.InstitutionNames
                .Where(r => r.ApprovalStatus == ApprovalStatus.Draft)
                .CountAsync(cancellationToken);

            return new InstitutionNameCountsByStatus(approvedCount, submittedCount, rejectedCount, draftCount);
        }
    }
}
