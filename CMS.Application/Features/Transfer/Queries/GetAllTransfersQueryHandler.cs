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
    public class GetAllTransfersQueryHandler : IRequestHandler<GetAllTransfersQuery, List<EmployeeTransferDto>>
    {
        private readonly IDataService _service;
        public GetAllTransfersQueryHandler(IDataService service)
        {
            _service = service;
        }
        public async Task<List<EmployeeTransferDto>> Handle(GetAllTransfersQuery request, CancellationToken cancellationToken)
        {
            var transfers = await _service.EmployeeTransfers
                .Include(t => t.Employee)
                .Include(t => t.FromBusinessUnit)
                .Include(t => t.ToBusinessUnit)
                .Include(t => t.FromJobRole)
                .Include(t => t.ToJobRole)
                .Select(t => new EmployeeTransferDto
                {
                    Id = t.Id,
                    EmployeeId = t.EmployeeId,
                    EmployeeName = t.Employee.FirstName + " " + t.Employee.LastName,
                    FromBusinessUnitName = t.FromBusinessUnit.Name,
                    ToBusinessUnitName = t.ToBusinessUnit.Name,
                    FromJobRoleName = t.FromJobRole.RoleName,
                    ToJobRoleName = t.ToJobRole.RoleName,
                    TransferType = t.TransferType,
                    TransferDate = t.EffectiveTransferDate,
                    TransferReason = t.TransferReason ?? string.Empty,
                    ApprovalStatus = t.ApprovalStatus,
                    Remark = t.Remark
                })
                .ToListAsync(cancellationToken);

            return transfers;
        }
    }
}
