using System.ComponentModel.DataAnnotations;
using CMS.Domain.Common;
using CMS.Domain.Employee;
using CMS.Domain.Enum;

namespace CMS.Domain.Employee.EmployeeActivities
{
    public class EmployeeWarning : WorkflowEnabledEntity
    {
        [Key]
        public int Id { get; set; }

        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }

        [Range(0, 100)]
        public double Percentage { get; set; }
        public ViolationType ViolationType { get; set; }

        public DateOnly WarningDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
        public WarningStatus WarningStatus { get; set; } = WarningStatus.FirstLevel;
        public string? Remark { get; set; }
    }
}
