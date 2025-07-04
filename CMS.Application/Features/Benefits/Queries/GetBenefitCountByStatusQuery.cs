using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.Queries
{
    public record BenefitCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);
    public record GetBenefitCountByStatusQuery() : IRequest<BenefitCountsByStatus>;
}
