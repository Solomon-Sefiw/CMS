using CMS.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.Archive
{
    public class DocketEntry : AuditableEntity
    {
        [Key]
        public int Id { get; set; }
        public string DocketNumber { get; set; } = string.Empty;
        public int CaseId { get; set; }
        public string? StoragePath { get; set; }
        public DateTime ArchivedAt { get; set; } = DateTime.UtcNow;
        public string? ArchivedBy { get; set; }
    }
}
