using CMS.Domain.Enum;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Dashboard.ApprovalQueries
{
    public record ApprovalStatusSummaryDto(ApprovalStatus Status, int TotalCount);
    public record GetApprovalStatusSummaryQuery : IRequest<List<ApprovalStatusSummaryDto>>;

   

}
