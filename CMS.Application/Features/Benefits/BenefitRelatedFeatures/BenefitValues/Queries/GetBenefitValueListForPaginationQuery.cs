using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Model;
using CMS.Domain.Enum;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Queries
{
    public record BenefitValueSearchResult(List<BenefitValueDto> Items, int TotalCount);
    public record GetBenefitValueListForPaginationQuery(ApprovalStatus Status, int PageNumber, int PageSize) : IRequest<BenefitValueSearchResult>;


}
