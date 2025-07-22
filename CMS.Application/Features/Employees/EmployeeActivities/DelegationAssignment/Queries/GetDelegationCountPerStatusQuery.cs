using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Queries
{
    public record DelegationCountsByStatus(int Approved, int Submitted, int Rejected, int Draft);
    public record GetDelegationCountPerStatusQuery(int Id) : IRequest<DelegationCountsByStatus>;

    public class GetDelegationCountPerStatusQueryHandler : IRequestHandler<GetDelegationCountPerStatusQuery, DelegationCountsByStatus>
    {
        private readonly IDataService _dataService;

        public GetDelegationCountPerStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<DelegationCountsByStatus> Handle(GetDelegationCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var approvedCount = await _dataService.Delegations
                .Where(r => r.ApprovalStatus == ApprovalStatus.Approved && r.EmployeeId == request.Id)
                .CountAsync(cancellationToken);

            var submittedCount = await _dataService.Delegations
                .Where(r => r.ApprovalStatus == ApprovalStatus.Submitted && r.EmployeeId == request.Id)
                .CountAsync(cancellationToken);

            var rejectedCount = await _dataService.Delegations
                .Where(r => r.ApprovalStatus == ApprovalStatus.Rejected && r.EmployeeId == request.Id)
                .CountAsync(cancellationToken);

            var draftCount = await _dataService.Delegations
                .Where(r => r.ApprovalStatus == ApprovalStatus.Draft && r.EmployeeId == request.Id)
                .CountAsync(cancellationToken);

            return new DelegationCountsByStatus(approvedCount, submittedCount, rejectedCount, draftCount);
        }
    }
}
