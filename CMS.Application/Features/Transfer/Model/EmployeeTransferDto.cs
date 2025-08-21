using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Transfer.Model
{
    public class EmployeeTransferDto
    {
        public int Id { get; set; }

        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = default!;

        public int FromBusinessUnitId { get; set; }
        public string FromBusinessUnitName { get; set; } = default!;

        public int ToBusinessUnitId { get; set; }
        public string ToBusinessUnitName { get; set; } = default!;

        public int FromJobRoleId { get; set; }
        public string FromJobRoleName { get; set; } = default!;

        public int ToJobRoleId { get; set; }
        public string ToJobRoleName { get; set; } = default!;

        public LateralTransferType TransferType { get; set; } 

        public DateOnly TransferDate { get; set; }

        public string TransferReason { get; set; } = default!;

        public ApprovalStatus ApprovalStatus { get; set; }

        public string? Remark { get; set; }
    }
}
