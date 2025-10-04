using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Transfer
{
    public class EmployeeTransfer 
    {
        [Key]
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public CMS.Domain.Employee.Employee Employee { get; set; }
        public int FromBusinessUnitId { get; set; }
        public BusinessUnit FromBusinessUnit { get; set; }
        public int FromJobRoleId { get; set; }
        public JobRole FromJobRole { get; set; }
        public int ToBusinessUnitId { get; set; }
        public BusinessUnit ToBusinessUnit { get; set; }
        public int ToJobRoleId { get; set; }
        public JobRole ToJobRole { get; set; }
        public LateralTransferType TransferType { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;
        public DateOnly EffectiveTransferDate { get; set; }
        public string? TransferReason { get; set; }
        public string? Remark { get; set; }
    }
}
