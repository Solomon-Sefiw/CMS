using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Queries;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Handlers
{
    public class GetBenefitUnitPriceCountPerStatusQueryHandler
        : IRequestHandler<GetBenefitUnitPriceCountPerStatusQuery, BenefitUnitPriceCountsByStatus>
    {
        private readonly IDataService _dataService;

        public GetBenefitUnitPriceCountPerStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<BenefitUnitPriceCountsByStatus> Handle(GetBenefitUnitPriceCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var prices = _dataService.BenefitUnitPrices.AsQueryable();

            var approved = await prices.CountAsync(p => p.ApprovalStatus == ApprovalStatus.Approved, cancellationToken);
            var approvalRequests = await prices.CountAsync(p => p.ApprovalStatus == ApprovalStatus.Submitted, cancellationToken);
            var rejected = await prices.CountAsync(p => p.ApprovalStatus == ApprovalStatus.Rejected, cancellationToken);
            var drafts = await prices.CountAsync(p => p.ApprovalStatus == ApprovalStatus.Draft, cancellationToken);

            return new BenefitUnitPriceCountsByStatus(approved, approvalRequests, rejected, drafts);
        }
    }
}
