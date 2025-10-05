using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Reemployments.Queries
{
    public record ReemploymentCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);
    public record GetReemploymentsCountByStatusQuery(int employeeId):IRequest<ReemploymentCountsByStatus>;
}
