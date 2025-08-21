using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Queries
{
    public record EmployeeWarningCountsByStatus(int Approved, int Submitted, int Rejected, int Draft);
    public record GetEmployeeWarningCountPerStatusQuery(int Id) : IRequest<EmployeeWarningCountsByStatus>;

    public class GetEmployeeWarningCountPerStatusQueryHandler : IRequestHandler<GetEmployeeWarningCountPerStatusQuery, EmployeeWarningCountsByStatus>
    {
        private readonly IDataService _dataService;

        public GetEmployeeWarningCountPerStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<EmployeeWarningCountsByStatus> Handle(GetEmployeeWarningCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var approvedCount = await _dataService.EmployeeWarnings
                .Where(r => r.ApprovalStatus == ApprovalStatus.Approved && r.EmployeeId == request.Id)
                .CountAsync(cancellationToken);

            var submittedCount = await _dataService.EmployeeWarnings
                .Where(r => r.ApprovalStatus == ApprovalStatus.Submitted && r.EmployeeId == request.Id)
                .CountAsync(cancellationToken);

            var rejectedCount = await _dataService.EmployeeWarnings
                .Where(r => r.ApprovalStatus == ApprovalStatus.Rejected && r.EmployeeId == request.Id)
                .CountAsync(cancellationToken);

            var draftCount = await _dataService.EmployeeWarnings
                .Where(r => r.ApprovalStatus == ApprovalStatus.Draft && r.EmployeeId == request.Id)
                .CountAsync(cancellationToken);

            return new EmployeeWarningCountsByStatus(approvedCount, submittedCount, rejectedCount, draftCount);
        }
    }
}
