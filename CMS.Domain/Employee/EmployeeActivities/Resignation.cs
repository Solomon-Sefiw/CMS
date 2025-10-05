using CMS.Domain.EmployeeDocument;
using CMS.Domain.Enum;
using System.ComponentModel.DataAnnotations;
namespace CMS.Domain.Employee.EmployeeActivities
{
    public class Resignation : WorkflowEnabledEntity
    {
        [Key]
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
        public decimal Salary { get; set; }
        public string WorkUnit { get; set; } = string.Empty;
        public DateOnly ResignationDate { get; set; }
        public ResignationType ResignationType { get; set; }
        public string ReasonForResignation { get; set; } = string.Empty;
        public string FinalSettlementDetails { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        // File Upload (store file path or blob reference)
        public ICollection<EmployeeFileDocument> EmployeeFileDocuments { get; set; } = new List<EmployeeFileDocument>();
    }

}
