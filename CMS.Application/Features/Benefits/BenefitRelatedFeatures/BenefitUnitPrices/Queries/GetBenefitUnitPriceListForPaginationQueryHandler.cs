using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Model;
using CMS.Services.DataService;
using CMS.Domain.Enum;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Queries
{
    public class GetBenefitUnitPriceListForPaginationQueryHandler
        : IRequestHandler<GetBenefitUnitPriceListForPaginationQuery, BenefitUnitPriceSearchResult>
    {
        private readonly IDataService _dataService;
        public GetBenefitUnitPriceListForPaginationQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<BenefitUnitPriceSearchResult> Handle(GetBenefitUnitPriceListForPaginationQuery request, CancellationToken cancellationToken)
        {
            var query = _dataService.BenefitUnitPrices
                .Include(p => p.Benefit)
                    .ThenInclude(b => b.UnitOfMeasurement)
                .Where(p => p.ApprovalStatus == request.Status)
                .AsQueryable();

            var total = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderByDescending(x => x.EffectiveDate)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(p => new BenefitUnitPriceDto
                {
                    Id = p.Id,
                    BenefitId = p.BenefitId,
                    BenefitName = p.Benefit.Name,
                    Price = p.Price,
                    EffectiveDate = p.EffectiveDate,
                    ApprovalStatus = p.ApprovalStatus,
                    UnitOfMeasurementName = p.Benefit.UnitOfMeasurement.Name,
                    Remark = p.Remark,
                    ActivationEnum=p.IsActive
                })
                .ToListAsync(cancellationToken);

            return new BenefitUnitPriceSearchResult(items, total);
        }

    }
}
