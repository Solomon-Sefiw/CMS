using CMS.Application.Features.Benefits.Model;
using CMS.Domain.Enum;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.Queries
{
    public record BenefitSearchResult(List<BenefitDto> Items, int TotalCount);
    public record GetBenefitListForPaginationQuery(ApprovalStatus Status, int PageNumber, int PageSize)
          : IRequest<BenefitSearchResult>;
}
