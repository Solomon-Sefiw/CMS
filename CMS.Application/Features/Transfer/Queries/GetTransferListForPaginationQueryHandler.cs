using CMS.Application.Features.Benefits.Model;
using CMS.Application.Features.Benefits.Queries;
using CMS.Application.Features.Transfer.Model;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Transfer.Queries
{

    public class GetTransferListForPaginationQueryHandler : IRequestHandler<GetTransferListForPaginationQuery, TransferSearchResult>
    {
        private readonly IDataService _dataService;
        public GetTransferListForPaginationQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<TransferSearchResult> Handle(GetTransferListForPaginationQuery request, CancellationToken cancellationToken)
        {
            var query = _dataService.EmployeeTransfers
                .Include(t => t.Employee)
                .Include(t => t.FromBusinessUnit)
                .Include(t => t.ToBusinessUnit)
                .Include(t => t.FromJobRole)
                .Include(t => t.ToJobRole)
                .Where(t => t.ApprovalStatus == request.Status && t.EmployeeId==request.employeeId)
                .AsQueryable();

            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderByDescending(t => t.Id)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(t => new EmployeeTransferDto
                {
                    Id = t.Id,
                    EmployeeId = t.EmployeeId,
                    EmployeeName = t.Employee.DisplayName ,
                    FromBusinessUnitName = t.FromBusinessUnit.Name,
                    ToBusinessUnitName = t.ToBusinessUnit.Name,
                    FromJobRoleName = t.FromJobRole.RoleName,
                    ToJobRoleName = t.ToJobRole.RoleName,
                    TransferType = t.TransferType,
                    TransferDate = t.EffectiveTransferDate,
                    ApprovalStatus = t.ApprovalStatus,
                    Remark = t.Remark,
                    TransferReason = t.TransferReason
                })
                .ToListAsync(cancellationToken);

            return new TransferSearchResult(items, totalCount);
        }
    }
}
