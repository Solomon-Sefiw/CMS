using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Queries
{
    public record SuspensionCountsByStatus(int Approved, int Submitted, int Rejected, int Draft);
    public record GetSuspensionCountPerStatusQuery(int EmployeeId) : IRequest<SuspensionCountsByStatus>;

    public class GetSuspensionCountPerStatusQueryHandler : IRequestHandler<GetSuspensionCountPerStatusQuery, SuspensionCountsByStatus>
    {
        private readonly IDataService dataService;

        public GetSuspensionCountPerStatusQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<SuspensionCountsByStatus> Handle(GetSuspensionCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var approved = await dataService.Suspensions.CountAsync(r => r.ApprovalStatus == ApprovalStatus.Approved && r.EmployeeId == request.EmployeeId, cancellationToken);
            var submitted = await dataService.Suspensions.CountAsync(r => r.ApprovalStatus == ApprovalStatus.Submitted && r.EmployeeId == request.EmployeeId, cancellationToken);
            var rejected = await dataService.Suspensions.CountAsync(r => r.ApprovalStatus == ApprovalStatus.Rejected && r.EmployeeId == request.EmployeeId, cancellationToken);
            var draft = await dataService.Suspensions.CountAsync(r => r.ApprovalStatus == ApprovalStatus.Draft && r.EmployeeId == request.EmployeeId, cancellationToken);

            return new SuspensionCountsByStatus(approved, submitted, rejected, draft);
        }
    }
}
