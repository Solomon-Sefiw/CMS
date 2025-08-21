using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Employee
{
    public class Reemployment
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
        public ReemploymentType ReemploymentType { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;
        public DateOnly ReemploymnetDate { get; set; }
        public String ReasonForReemploymnet { get; set; }
        public String? Remark { get; set; }
    }
}
