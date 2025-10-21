using CMS.Domain.Common;
using CMS.Domain.Employee.EmployeeActivities;
using CMS.Domain.Enum;

namespace CMS.Domain.Cases.CaseDocument
{
    public class CaseFileDocument : AuditableEntity
    {
        public Guid Id { get; set; }
        public int CaseId { get; set; }
        public Case Case { get; set; } = null!;
        public CaseDocumentType CaseDocumentType { get; set; } 
        public string FileName { get; set; } = default!;
        public string FilePath { get; set; } = default!;
        public string ContentType { get; set; } = default!;
        public string Remark { get; set; }
        public ApprovalStatus? ApprovalStatus { get; set; }

    }
}
