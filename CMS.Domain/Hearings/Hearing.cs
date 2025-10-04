using CMS.Domain.Common;
using CMS.Domain.Courts;
using CMS.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.Hearings
{
    public class Hearing : AuditableEntity
    {
        [Key]
        public int Id { get; set; }
        public int CaseId { get; set; }
        public CMS.Domain.Cases.Case? Case { get; set; }
        public DateTime ScheduledAt { get; set; }
        public HearingType HearingType { get; set; } = HearingType.Main;
        public string? LocationOrUrl { get; set; }
        public string? ResponsibleJudgeId { get; set; }
        public ICollection<HearingParticipant> Participants { get; set; } = new List<HearingParticipant>();
        public int? ChilotId { get; set; }
        public Chilot? Chilot { get; set; }
        public int? BusinessUnitId { get; set; }
        public CMS.Domain.BusinessUnit? BusinessUnit { get; set; }
        public string? Notes { get; set; }
    }

    public class HearingParticipant
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public string? Role { get; set; }
    }
}
