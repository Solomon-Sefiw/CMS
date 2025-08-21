using CMS.Application.Features.Transfer.Queries;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Reemployments.Queries
{
    public class GetReemploymentsCountByStatusQueryHandler : IRequestHandler<GetReemploymentsCountByStatusQuery, ReemploymentCountsByStatus>
    {
        private readonly IDataService _dataService;
        public GetReemploymentsCountByStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<ReemploymentCountsByStatus> Handle(GetReemploymentsCountByStatusQuery request, CancellationToken cancellationToken)
        {
            var approved = await _dataService.Reemployments.Where(a=>a.EmployeeId==request.employeeId).CountAsync(b => b.ApprovalStatus == ApprovalStatus.Approved, cancellationToken);
            var approvalRequests = await _dataService.Reemployments.Where(a => a.EmployeeId == request.employeeId).CountAsync(b => b.ApprovalStatus == ApprovalStatus.Submitted, cancellationToken);
            var rejected = await _dataService.Reemployments.Where(a => a.EmployeeId == request.employeeId).CountAsync(b => b.ApprovalStatus == ApprovalStatus.Rejected, cancellationToken);
            var drafts = await _dataService.Reemployments.Where(a => a.EmployeeId == request.employeeId).CountAsync(b => b.ApprovalStatus == ApprovalStatus.Draft, cancellationToken);

            return new ReemploymentCountsByStatus(approved, approvalRequests, rejected, drafts);
        }
    }
}
