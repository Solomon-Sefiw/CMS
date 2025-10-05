using CMS.Domain.Common;
using CMS.Domain.Employee.EmployeeActivities;
using CMS.Domain.Enum;

namespace CMS.Domain.EmployeeDocument
{
    public class EmployeeFileDocument : AuditableEntity
    {
        public Guid Id { get; set; }
        public int EmployeeId { get; set; }
        public CMS.Domain.Employee.Employee Employee { get; set; } = null!;
        public int? SuspensionId { get; set; }
        public Suspension Suspension { get; set; } = null!;
        public int? ResignationId { get; set; }
        public Resignation Resignation { get; set; } = null!;
        public DocumentType DocumentType { get; set; } 
        public string FileName { get; set; } = default!;
        public string FilePath { get; set; } = default!;
        public string ContentType { get; set; } = default!;
        public string Remark { get; set; }
        public ApprovalStatus? ApprovalStatus { get; set; }

    }
}
