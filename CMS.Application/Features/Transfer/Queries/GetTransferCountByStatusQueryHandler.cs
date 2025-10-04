using CMS.Application.Features.Benefits.Queries;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Transfer.Queries
{
    public class GetTransferCountByStatusQueryHandler : IRequestHandler<GetTransferCountByStatusQuery, TransferCountsByStatus>
    {
        private readonly IDataService _dataService;
        public GetTransferCountByStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<TransferCountsByStatus> Handle(GetTransferCountByStatusQuery request, CancellationToken cancellationToken)
        {
            var approved = await _dataService.EmployeeTransfers
                .Where(a=>a.EmployeeId==request.employeeId)
                .CountAsync(b => b.ApprovalStatus == ApprovalStatus.Approved, cancellationToken);
            var approvalRequests = await _dataService.EmployeeTransfers
                .Where(a => a.EmployeeId == request.employeeId)
                .CountAsync(b => b.ApprovalStatus == ApprovalStatus.Submitted, cancellationToken);
            var rejected = await _dataService.EmployeeTransfers
                .Where(a => a.EmployeeId == request.employeeId)
                .CountAsync(b => b.ApprovalStatus == ApprovalStatus.Rejected, cancellationToken);
            var drafts = await _dataService.EmployeeTransfers
                .Where(a => a.EmployeeId == request.employeeId)
                .CountAsync(b => b.ApprovalStatus == ApprovalStatus.Draft, cancellationToken);

            return new TransferCountsByStatus(approved, approvalRequests, rejected, drafts);
        }
    }
}
