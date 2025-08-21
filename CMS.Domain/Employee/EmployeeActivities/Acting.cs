using CMS.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.Acting
{
    public class Acting 
    {
        [Key]
        public int Id { get; set; }

        public int EmployeeId { get; set; }
        public Employee.Employee Employee { get; set; }

        public int JobRoleId { get; set; }
        public JobRole JobRole { get; set; }

        public int? BusinessUnitId { get; set; }
        public BusinessUnit? BusinessUnit { get; set; }

        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }

        public ActingType ActingType { get; set; }

        // New fields for history and reassignment
        public int? PreviousJobRoleId { get; set; }
        public JobRole? PreviousJobRole { get; set; }
        public int? PreviousBusinessUnitId { get; set; }
        public bool IsActive { get; set; } = true;
        public BusinessUnit? PreviousBusinessUnit { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;

    }
}
