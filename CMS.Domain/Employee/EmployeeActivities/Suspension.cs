using CMS.Domain.EmployeeDocument;
using CMS.Domain.Enum;
using System.ComponentModel.DataAnnotations;
namespace CMS.Domain.Employee.EmployeeActivities
{
    public class Suspension : WorkflowEnabledEntity
    {
        [Key]
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public decimal Salary { get; set; }
        public SuspensionReason Reason { get; set; }
        public string Description { get; set; } = string.Empty;
        public string ConditionsForReinstatement { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public ICollection<EmployeeFileDocument> EmployeeFileDocuments { get; set; } = new List<EmployeeFileDocument>();
    }
}
