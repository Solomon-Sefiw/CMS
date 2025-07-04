using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Model;
using CMS.Domain.Enum;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Queries
{
    public record BenefitUnitPriceSearchResult(List<BenefitUnitPriceDto> Items, int TotalCount);
    public record GetBenefitUnitPriceListForPaginationQuery(ApprovalStatus Status, int PageNumber, int PageSize) : IRequest<BenefitUnitPriceSearchResult>;
}
