using CMS.Domain.Common;
using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Transfer
{
    public class EmployeeTransferSnapshot
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public CMS.Domain.Employee.Employee Employee { get; set; }
        public int PreviousBusinessUnitId { get; set; }
        public BusinessUnit PreviousBusinessUnit { get; set; }
        public int PreviousJobRoleId { get; set; }
        public JobRole PreviousJobRole { get; set; }
        public DateOnly EffectiveTransferDate { get; set; }
        public LateralTransferType TransferType { get; set; }
        public string? TransferReason { get; set; }
        public string? Remark { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
