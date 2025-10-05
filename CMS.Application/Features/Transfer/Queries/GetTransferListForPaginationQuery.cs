using CMS.Application.Features.Benefits.Model;
using CMS.Application.Features.Transfer.Model;
using CMS.Domain.Enum;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Transfer.Queries
{
    public record TransferSearchResult(List<EmployeeTransferDto> Items, int TotalCount);
    public record GetTransferListForPaginationQuery(ApprovalStatus Status, int PageNumber, int PageSize, int employeeId)
          : IRequest<TransferSearchResult>;
}
