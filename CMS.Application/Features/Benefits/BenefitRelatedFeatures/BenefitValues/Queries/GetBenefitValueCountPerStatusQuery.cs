using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Queries
{
    public record BenefitValueCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);
    public record GetBenefitValueCountPerStatusQuery() : IRequest<BenefitValueCountsByStatus>;

}
