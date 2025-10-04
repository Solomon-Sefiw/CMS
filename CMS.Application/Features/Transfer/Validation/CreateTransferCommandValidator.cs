using FluentValidation;
using CMS.Application.Features.Employees.EmployeeActivities.Acting.Commands.CreateActingAssignment;
using CMS.Application.Features.Transfer.Commands;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Transfer.Validation
{
    public class CreateTransferCommandValidator : AbstractValidator<CreateTransferCommand>
    {
        private readonly IDataService _dataService;

        public CreateTransferCommandValidator(IDataService dataService)
        {
            _dataService = dataService;

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

            RuleFor(x => x)
              .MustAsync(IsEmployeeStatusApproved)
              .WithMessage("Employee Status is not Approved!");

            When(x => x.TransferType 
            is LateralTransferType.BusinessUnitChange
            or LateralTransferType.BusinessUnitAndJobRoleChange,
                () =>
                {
                    RuleFor(x => x.ToBusinessUnitId)
                        .GreaterThan(0).WithMessage("Target Business Unit is required.")
                        .MustAsync(BeDifferentBusinessUnit).WithMessage("Cannot transfer employee to the same Business Unit.");
                });

            When(x => x.TransferType 
            is LateralTransferType.JobRoleChange
            or LateralTransferType.BusinessUnitAndJobRoleChange,
                () =>
                {
                    RuleFor(x => x.ToJobRoleId)
                        .GreaterThan(0).WithMessage("Target Job Role is required.")
                        .MustAsync(BeDifferentJobRole).WithMessage("Cannot transfer employee to the same Job Role.");
                });
        }
        private async Task<bool> EmployeeExists(int employeeId, CancellationToken cancellationToken)
        {
            return await _dataService.Employees.AnyAsync(e => e.Id == employeeId, cancellationToken);
        }
        private async Task<bool> BeDifferentBusinessUnit(CreateTransferCommand command, int toBusinessUnitId, CancellationToken token)
        {
            var employee = await _dataService.Employees
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == command.EmployeeId, token);

            if (employee == null)
                return true; 

            return employee.BusinessUnitID != toBusinessUnitId;
        }
        private async Task<bool> BeDifferentJobRole(CreateTransferCommand command, int toJobRoleId, CancellationToken token)
        {
            var employee = await _dataService.Employees
                .Include(e => e.Job)
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == command.EmployeeId, token);

            if (employee?.Job == null)
                return true;

            return employee.Job.JobRoleId != toJobRoleId;
        }

        private async Task<bool> IsEmployeeStatusApproved(CreateTransferCommand command, CancellationToken cancellationToken)
        {
            return await _dataService.Employees
                  .AnyAsync(d =>
                  d.Id == command.EmployeeId &&
                  d.ApprovalStatus == ApprovalStatus.Approved,
                      cancellationToken);
        }
    }
}
