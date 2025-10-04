using CMS.Application.Features.Reemployments.Model;
using CMS.Application.Features.Transfer.Model;
using CMS.Domain.Enum;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Reemployments.Queries
{
    public record ReemploymentSearchResult(List<ReemploymentDto> Items, int TotalCount);
    public record GetReemploymentListForPaginationQuery(ApprovalStatus Status, int PageNumber, int PageSize,int employeeId)
        :IRequest<ReemploymentSearchResult>;

}
