using CMS.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.Timelines
{
    public class CaseTimeline : AuditableEntity
    {
        [Key]
        public int Id { get; set; }
        public int CaseId { get; set; }
        public CMS.Domain.Cases.Case? Case { get; set; }
        [Required]
        public string EventType { get; set; } = string.Empty;
        public string? Details { get; set; }
        public string? ActorUserId { get; set; }
        public DateTime EventAt { get; set; } = DateTime.UtcNow;
    }
}
