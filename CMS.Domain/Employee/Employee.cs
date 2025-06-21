
using CMS.Domain;
using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.Employee
{
    public class Employee : WorkflowEnabledEntity
    {
        [Key]
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string DisplayName { get; set; }

        public string AmharicFirstName { get; set; }
        public string? AmharicMiddleName { get; set; }
        public string? AmharicLastName { get; set; }
        public string AmharicDisplayName { get; set; }
        public int BusinessUnitID { get; set; }
        public int JobId { get; set; }
        public DateOnly BirthDate { get; set; }
        public DateOnly EmployementDate { get; set; }
        public bool IsNew { get; set; }

        public string? EmployeeIdCardStatusRemark { get; set; }
    }

}
