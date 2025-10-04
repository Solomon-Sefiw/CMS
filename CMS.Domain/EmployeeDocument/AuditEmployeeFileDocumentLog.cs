using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.EmployeeDocument
{
    public class AuditEmployeeFileDocumentLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string EntityName { get; set; } = default!;
        public string ActionType { get; set; } = default!; // e.g., "UPLOAD", "DELETE", etc.
        public string PerformedBy { get; set; } = default!;
        public string? PerformedByUserId { get; set; }
        public int? AffectedEmployeeId { get; set; }
        public string AffectedEmployeeName { get; set; } = default!;
        public string OldFileName { get; set; } = default!; 
        public string NewFileName { get; set; } = default!; 
        public string Details { get; set; } = default!;
        public string Remark { get; set; }
        public DateTime PerformedAt { get; set; } = DateTime.UtcNow;
        public CMS.Domain.Employee.Employee Employee { get; set; } = null!;

    }
}
