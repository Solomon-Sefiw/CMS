using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Model;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Queries;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Handlers
{
    public class GetAllBenefitUnitPriceQueryHandler
        : IRequestHandler<GetAllBenefitUnitPriceQuery, List<BenefitUnitPriceDto>>
    {
        private readonly IDataService _dataService;

        public GetAllBenefitUnitPriceQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<List<BenefitUnitPriceDto>> Handle(GetAllBenefitUnitPriceQuery request, CancellationToken cancellationToken)
        {
            var prices = await _dataService.BenefitUnitPrices
                .Include(p => p.Benefit)
                    .ThenInclude(b => b.UnitOfMeasurement)
                .ToListAsync(cancellationToken);

            var result = prices.Select(p => new BenefitUnitPriceDto
            {
                Id = p.Id,
                BenefitId = p.Benefit.Id,
                BenefitName = p.Benefit.Name,
                Price = p.Price,
                UnitOfMeasurementName = p.Benefit.UnitOfMeasurement.Name,
                ApprovalStatus = p.ApprovalStatus,
                EffectiveDate = p.EffectiveDate,
                Remark = p.Remark,
                ActivationEnum=p.IsActive
            }).ToList();

            return result;
        }
    }
}
