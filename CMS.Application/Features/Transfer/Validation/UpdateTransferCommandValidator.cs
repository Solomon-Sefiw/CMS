using FluentValidation;
using CMS.Application.Features.Transfer.Commands;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Transfer.Validation
{
    public class UpdateTransferCommandValidator : AbstractValidator<UpdateTransferCommand>
    {
        private readonly IDataService _dataService;

        public UpdateTransferCommandValidator(IDataService dataService)
        {
            _dataService = dataService;

            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Transfer ID is required.")
                .MustAsync(TransferExists).WithMessage("Transfer record does not exist.");

            RuleFor(x => x.EmployeeId)
                .GreaterThan(0).WithMessage("Employee is required.")
                .MustAsync(EmployeeExists).WithMessage("Employee does not exist.");

            RuleFor(x => x.TransferType)
                .IsInEnum().WithMessage("Invalid transfer type.");

            RuleFor(x => x.TransferDate)
                .NotEmpty().WithMessage("Transfer date is required.");

            RuleFor(x => x.TransferReason)
                .NotEmpty().WithMessage("Transfer reason is required.")
                .MaximumLength(500).WithMessage("Transfer reason must not exceed 500 characters.");

            When(x => x.TransferType is LateralTransferType.BusinessUnitChange or LateralTransferType.BusinessUnitAndJobRoleChange, () =>
            {
                RuleFor(x => x.ToBusinessUnitId)
                    .GreaterThan(0).WithMessage("Target Business Unit is required.")
                    .MustAsync(BeDifferentBusinessUnit).WithMessage("Cannot transfer employee to the same Business Unit.");
            });

            When(x => x.TransferType is LateralTransferType.JobRoleChange or LateralTransferType.BusinessUnitAndJobRoleChange, () =>
            {
                RuleFor(x => x.ToJobRoleId)
                    .GreaterThan(0).WithMessage("Target Job Role is required.")
                    .MustAsync(BeDifferentJobRole).WithMessage("Cannot transfer employee to the same Job Role.");
            });
        }

        private async Task<bool> TransferExists(int transferId, CancellationToken token)
        {
            return await _dataService.EmployeeTransfers.AnyAsync(t => t.Id == transferId, token);
        }

        private async Task<bool> EmployeeExists(int employeeId, CancellationToken token)
        {
            return await _dataService.Employees.AnyAsync(e => e.Id == employeeId, token);
        }

        private async Task<bool> BeDifferentBusinessUnit(UpdateTransferCommand command, int toBusinessUnitId, CancellationToken token)
        {
            var employee = await _dataService.Employees
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == command.EmployeeId, token);

            if (employee == null)
                return true; 

            return employee.BusinessUnitID != toBusinessUnitId;
        }

        private async Task<bool> BeDifferentJobRole(UpdateTransferCommand command, int toJobRoleId, CancellationToken token)
        {
            var employee = await _dataService.Employees
                .Include(e => e.Job)
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == command.EmployeeId, token);

            if (employee?.Job == null)
                return true;

            return employee.Job.JobRoleId != toJobRoleId;
        }
    }
}
