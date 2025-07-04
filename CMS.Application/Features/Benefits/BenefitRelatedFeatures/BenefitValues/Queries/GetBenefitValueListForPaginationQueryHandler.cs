using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Model;
using CMS.Domain.Enum;
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
    public class GetBenefitValueListForPaginationQueryHandler : IRequestHandler<GetBenefitValueListForPaginationQuery, BenefitValueSearchResult>
    {
        private readonly IDataService _dataService;

        public GetBenefitValueListForPaginationQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<BenefitValueSearchResult> Handle(GetBenefitValueListForPaginationQuery request, CancellationToken cancellationToken)
        {
            var benefitValueQuery = _dataService.BenefitValues
                .Include(bv => bv.Benefit)
                    .ThenInclude(b => b.UnitOfMeasurement)
                .Where(bv => bv.ApprovalStatus == request.Status)
                .AsQueryable();

            var count = await benefitValueQuery.CountAsync(cancellationToken);

            var benefitValuePaginated = await benefitValueQuery
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var result = new List<BenefitValueDto>();

            foreach (var benefitValue in benefitValuePaginated)
            {
                var benefit = benefitValue.Benefit;
                var unitOfMeasurement = benefit?.UnitOfMeasurement;
                var isUnitPriced = unitOfMeasurement?.IsUnitPriced ?? false;

                decimal? unitPrice = null;
                decimal? totalAmount = null;

                if (isUnitPriced)
                {
                    var latestPrice = await _dataService.BenefitUnitPrices
                        .Where(p => p.BenefitId == benefit.Id && p.IsActive == ActivationEnum.Active)
                        .OrderByDescending(p => p.EffectiveDate)
                        .FirstOrDefaultAsync(cancellationToken);

                    unitPrice = latestPrice?.Price;
                    totalAmount = benefitValue.Value * (unitPrice ?? 0);
                }

                result.Add(new BenefitValueDto
                {
                    Id = benefitValue.Id,
                    BenefitId = benefitValue.BenefitId,
                    BenefitName = benefit?.Name ?? string.Empty,
                    Value = benefitValue.Value,
                    UnitPrice = unitPrice,
                    CalculatedBenefitAmount = totalAmount,
                    IsUnitPriced = isUnitPriced,
                    UnitOfMeasurementName = unitOfMeasurement?.Name ?? string.Empty,
                    ApprovalStatus = benefitValue.ApprovalStatus,
                    Description = benefitValue.Description,
                    Remark = benefitValue.Remark
                });
            }
            return new BenefitValueSearchResult(result, count);
        }
    }

}
