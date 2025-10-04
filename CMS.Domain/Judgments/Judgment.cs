using CMS.Domain.Common;
using CMS.Domain.User;
using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.Judgments
{
    public class Judgment : AuditableEntity
    {
        [Key]
        public int Id { get; set; }
        public int CaseId { get; set; }
        public CMS.Domain.Cases.Case? Case { get; set; }
        public string HtmlContent { get; set; } = string.Empty;
        public string? PdfFilePath { get; set; }
        public string? SignedByUserId { get; set; }
        public HRUser? SignedBy { get; set; }
        public DateTime? SignedAt { get; set; }
        public string? FileHash { get; set; }
        public bool IsPublished { get; set; } = false;
        public DateTime? PublishedAt { get; set; }
    }
}
