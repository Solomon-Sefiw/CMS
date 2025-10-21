using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Domain.Cases.CaseDocument
{
    public class AuditCaseFileDocumentLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string EntityName { get; set; } = default!;
        public string ActionType { get; set; } = default!;
        public string PerformedBy { get; set; } = default!;
        public string? PerformedByUserId { get; set; }

        [ForeignKey(nameof(Case))] // ✅ Explicitly tell EF that this links to Case
        public int? AffectedCaseId { get; set; }

        public string AffectedCaseName { get; set; } = default!;
        public string OldFileName { get; set; } = default!;
        public string NewFileName { get; set; } = default!;
        public string Details { get; set; } = default!;
        public string Remark { get; set; } = default!;
        public DateTime PerformedAt { get; set; } = DateTime.UtcNow;

        public Case? Case { get; set; } // ✅ Make this nullable to avoid FK violations
    }
}
