using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.Delegations
{
    public class Delegation : WorkflowEnabledEntity
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
        public bool IsActive { get; set; } = true;

    }

}
