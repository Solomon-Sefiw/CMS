
using CMS.Application.Features.Transfer.Commands;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Domain.Transfer;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Transfer.Handlers
{
    public class ApproveTransferHandler : IRequestHandler<ApproveTransferCommand, bool>
    {
        private readonly IDataService _dataService;
        public ApproveTransferHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<bool> Handle(ApproveTransferCommand request, CancellationToken cancellationToken)
        {
            var transfer = await _dataService.EmployeeTransfers
                .Include(t => t.Employee)
                .ThenInclude(e => e.Job)
                .ThenInclude(j => j.JobRole)
                .ThenInclude(r => r.JobGrade)
                .ThenInclude(g => g.Steps)
                .Include(t => t.Employee.BusinessUnits)
                .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);

            if (transfer == null)
                throw new Exception("Transfer record not found.");

            var employee = transfer.Employee;
            if (employee == null)
                throw new Exception("Employee not found.");

            var currentJobRole = employee.Job?.JobRole;
            var currentBussinessUnit = employee.BusinessUnits?.Name;
            var currentJobGrade = currentJobRole?.JobGrade;

            var businessUnitAddress = await _dataService.Addresses
                .FirstOrDefaultAsync(a => a.RequestId == employee.BusinessUnitID
                    && a.AddressType == AddressTypeEnum.BusinessUnitAddress, cancellationToken);

            var buCity = businessUnitAddress?.City ?? "N/A";

            // Record transfer snapshot
            var history = new EmployeeTransferSnapshot
            {
                EmployeeId = employee.Id,
                PreviousBusinessUnitId = employee.BusinessUnitID,
                PreviousJobRoleId = currentJobRole?.Id ?? 0,
                EffectiveTransferDate = transfer.EffectiveTransferDate,
                TransferType = transfer.TransferType,
                TransferReason = transfer.TransferReason,
                Remark = transfer.Remark
            };
            _dataService.EmployeeTransferSnapshots.Add(history);

            // Record experience only for job role change or both
            if ((transfer.TransferType == LateralTransferType.JobRoleChange ||
                 transfer.TransferType == LateralTransferType.BusinessUnitAndJobRoleChange) &&
                currentJobRole != null && currentJobGrade != null)
            {
                var lastStep = currentJobGrade.Steps
                    .OrderByDescending(s => s.StepNumber)
                    .FirstOrDefault();

                decimal calculatedSalary = lastStep != null
                    ? currentJobGrade.BaseSalary * (1 + currentJobGrade.StepCoefficient * (lastStep.StepNumber - 1))
                    : currentJobGrade.BaseSalary;

                var previousExperience = await _dataService.EmployeeExperiences
                    .Where(e => e.EmployeeId == employee.Id && e.EndDate == null)
                    .OrderByDescending(e => e.StartDate)
                    .FirstOrDefaultAsync(cancellationToken);

                if (previousExperience != null)
                {
                    previousExperience.EndDate = transfer.EffectiveTransferDate;
                }

                var newExperience = new EmployeeExperience
                {
                    EmployeeId = employee.Id,
                    FirmName = "Amhara Court",
                    StartDate = transfer.EffectiveTransferDate.AddDays(1),
                    EndDate = null,
                    JobTitle = currentJobRole.RoleName,
                    City = buCity,
                    LastSalary = calculatedSalary,
                    ReasonForResignation = "Transferred internally",
                    ExperienceType = ExperienceType.Transfer
                };

                _dataService.EmployeeExperiences.Add(newExperience);
            }
            // Apply transfer changes
            switch (transfer.TransferType)
            {
                case LateralTransferType.BusinessUnitChange:
                    employee.BusinessUnitID = transfer.ToBusinessUnitId;
                    employee.SkipStateTransitionCheck = true;
                    break;

                case LateralTransferType.JobRoleChange:
                    employee.Job.JobRoleId = transfer.ToJobRoleId;
                    break;

                case LateralTransferType.BusinessUnitAndJobRoleChange:
                    employee.BusinessUnitID = transfer.ToBusinessUnitId;
                    employee.Job.JobRoleId = transfer.ToJobRoleId;
                    employee.SkipStateTransitionCheck = true;
                    break;

                default:
                    throw new InvalidOperationException("Invalid transfer type.");
            }

            // Update statuses
            employee.ApprovalStatus = ApprovalStatus.Approved;
            employee.EmployeeStatus = EmployeeStatusEnum.Active;
            transfer.ApprovalStatus = ApprovalStatus.Approved;
            transfer.Remark = request.Comment;

            await _dataService.SaveAsync(cancellationToken);
            return true;
        }
    }
}

