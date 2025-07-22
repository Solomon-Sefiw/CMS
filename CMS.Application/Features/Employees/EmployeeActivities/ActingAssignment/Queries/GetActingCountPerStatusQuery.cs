using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Queries
{

    public record ActingCountsByStatus(int Approved, int Submitted, int Rejected, int Draft);
    public record GetActingCountPerStatusQuery(int Id) : IRequest<ActingCountsByStatus>;

    public class GetActingCountPerStatusQueryHandler : IRequestHandler<GetActingCountPerStatusQuery, ActingCountsByStatus>
    {
        private readonly IDataService _dataService;

        public GetActingCountPerStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<ActingCountsByStatus> Handle(GetActingCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var approvedCount = await _dataService.Actings
                .Where(r => r.ApprovalStatus == ApprovalStatus.Approved && r.EmployeeId == request.Id)
                .CountAsync(cancellationToken);

            var submittedCount = await _dataService.Actings
                .Where(r => r.ApprovalStatus == ApprovalStatus.Submitted && r.EmployeeId == request.Id)
                .CountAsync(cancellationToken);

            var rejectedCount = await _dataService.Actings
                .Where(r => r.ApprovalStatus == ApprovalStatus.Rejected && r.EmployeeId == request.Id)
                .CountAsync(cancellationToken);

            var draftCount = await _dataService.Actings
                .Where(r => r.ApprovalStatus == ApprovalStatus.Draft && r.EmployeeId == request.Id)
                .CountAsync(cancellationToken);

            return new ActingCountsByStatus(approvedCount, submittedCount, rejectedCount, draftCount);
        }
    }
}
