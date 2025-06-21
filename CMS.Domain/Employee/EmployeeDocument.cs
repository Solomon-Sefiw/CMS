using CMS.Domain.Common;
using CMS.Domain.Enum;

namespace CMS.Domain.Employee
{
    public class EmployeeDocument : AuditableSoftDeleteEntity
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public DocumentType DocumentType { get; set; }
        public string DocumentId { get; set; }
        public string FileName { get; set; }
    }
}
