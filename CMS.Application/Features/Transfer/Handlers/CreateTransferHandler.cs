using CMS.Application.Features.Employees;
using CMS.Application.Features.Transfer.Commands;
using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Domain.Transfer;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static CMS.Application.Security.AuthPolicy.Employee;

namespace CMS.Application.Features.Transfer.Handlers
{
    public class CreateTransferHandler : IRequestHandler<CreateTransferCommand, int>
    {
        private readonly IDataService _dataService;
        public CreateTransferHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<int> Handle(CreateTransferCommand request, CancellationToken cancellationToken)
        {
            var employee = await _dataService.Employees
                .Include(e => e.Job)
                .FirstOrDefaultAsync(e => e.Id == request.EmployeeId, cancellationToken);

            if (employee == null)
                throw new Exception("Employee not found.");

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

            var transfer = new EmployeeTransfer
            {
                EmployeeId = request.EmployeeId,
                FromBusinessUnitId = employee.BusinessUnitID,
                FromJobRoleId = employee.Job.JobRoleId,
                ToBusinessUnitId = toBusinessUnitId,
                ToJobRoleId = toJobRoleId,
                TransferType = request.TransferType,
                EffectiveTransferDate = request.TransferDate,
                TransferReason = request.TransferReason
            };
                _dataService.EmployeeTransfers.Add(transfer);
                await _dataService.SaveAsync(cancellationToken);

            return transfer.Id ;
        }
    }
}
