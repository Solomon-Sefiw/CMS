using CMS.Domain.Enum;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Dashboard.ApprovalQueries
{
    public record ApprovalItemDto(
       string Id,
       string Module,
       string Title,
       string SubmittedBy,
       DateTime SubmittedDate,
       ApprovalStatus Status,
       string Details
   );

    public record PaginatedApprovalResult(
        List<ApprovalItemDto> Items,
        int TotalCount,
        int PageNumber,
        int PageSize
    );

    public record GetAllApprovalItemsQuery(
        int PageNumber,
        int PageSize
    ) : IRequest<PaginatedApprovalResult>;


}
