using CMS.Application.Features.Transfer.Commands;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Transfer.Handlers
{
    public class UpdateTransferHandler : IRequestHandler<UpdateTransferCommand, bool>
    {
        private readonly IDataService _dataService;
        public UpdateTransferHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<bool> Handle(UpdateTransferCommand request, CancellationToken cancellationToken)
        {
            var transfer = await _dataService.EmployeeTransfers
                .Include(t => t.Employee)
                .ThenInclude(e => e.Job)
                .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);

            if (transfer == null)
                throw new Exception("Transfer record not found.");

            var employee = transfer.Employee;
            if (employee == null)
                throw new Exception("Associated employee not found.");

            int toBusinessUnitId = request.ToBusinessUnitId;
            int toJobRoleId = request.ToJobRoleId;

            switch (request.TransferType)
            {
                case LateralTransferType.BusinessUnitChange:
                    toJobRoleId = employee.Job.JobRoleId;
                    break;
                case LateralTransferType.JobRoleChange:
                    toBusinessUnitId = employee.BusinessUnitID;
                    break;
                case LateralTransferType.BusinessUnitAndJobRoleChange:
                    break;
                default:
                    throw new InvalidOperationException("Invalid transfer type.");
            }

            transfer.ToBusinessUnitId = toBusinessUnitId;
            transfer.ToJobRoleId = toJobRoleId;
            transfer.TransferType = request.TransferType;
            transfer.EffectiveTransferDate = request.TransferDate;
            transfer.TransferReason = request.TransferReason;
            transfer.ApprovalStatus = ApprovalStatus.Draft;

            await _dataService.SaveAsync(cancellationToken);
            return true;
        }
    }
}
