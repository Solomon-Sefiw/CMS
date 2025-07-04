using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Model;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Queries
{
    public class GetAllBenefitValueQueryHandler : IRequestHandler<GetAllBenefitValueQuery, List<BenefitValueDto>>
    {
        private readonly IDataService _dataService;

        public GetAllBenefitValueQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<List<BenefitValueDto>> Handle(GetAllBenefitValueQuery request, CancellationToken cancellationToken)
        {
            var benefitValues = await _dataService.BenefitValues
                .Include(b => b.Benefit)
                    .ThenInclude(b => b.UnitOfMeasurement)
                .ToListAsync(cancellationToken);

            var latestPrices = await _dataService.BenefitUnitPrices
                .Where(p => p.EffectiveDate <= DateTime.Today)
                .GroupBy(p => p.BenefitId)
                .Select(g => g.OrderByDescending(p => p.EffectiveDate).First())
                .ToDictionaryAsync(p => p.BenefitId, cancellationToken);

            var benefitValueDtoList = new List<BenefitValueDto>();

            foreach (var benefitValue in benefitValues)
            {
                var benefit = benefitValue.Benefit;
                var unitOfMeasurement = benefit.UnitOfMeasurement;
                var isUnitPriced = unitOfMeasurement.IsUnitPriced;

                decimal? unitPrice = isUnitPriced && latestPrices.TryGetValue(benefit.Id, out var price)
                    ? price.Price
                    : null;

                decimal? totalAmount = isUnitPriced ? benefitValue.Value * unitPrice : null;

                benefitValueDtoList.Add(new BenefitValueDto
                {
                    Id = benefitValue.Id,
                    BenefitId = benefit.Id,
                    BenefitName = benefit.Name,
                    Value = benefitValue.Value,
                    UnitPrice = unitPrice,
                    CalculatedBenefitAmount = totalAmount,
                    ApprovalStatus = benefitValue.ApprovalStatus,
                    Description = benefitValue.Description,
                    Remark = benefitValue.Remark,
                    IsUnitPriced = isUnitPriced,
                    UnitOfMeasurementName = benefitValue.Benefit.UnitOfMeasurement.Name
                });
            }
            return benefitValueDtoList;
        }

    }
}
