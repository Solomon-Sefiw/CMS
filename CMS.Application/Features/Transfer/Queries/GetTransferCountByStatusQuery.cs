using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Transfer.Queries
{
    public record TransferCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);
    public record GetTransferCountByStatusQuery(int employeeId) : IRequest<TransferCountsByStatus>;
 
}
