using CMS.Domain.Appointments;
using CMS.Domain.Assignment;
using CMS.Domain.Cases.CaseDocument;
using CMS.Domain.Chat;
using CMS.Domain.Common;
using CMS.Domain.Courts;
using CMS.Domain.Enum;
using CMS.Domain.Hearings;
using CMS.Domain.Judgments;
using CMS.Domain.Payments;
using CMS.Domain.Templates;
using CMS.Domain.Timelines;
using CMS.Domain.User;
using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.Cases
{
    public class Case : WorkflowEnabledEntity
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string CaseNumber { get; set; } = string.Empty;
        public CaseType CaseType { get; set; } = CaseType.Direct;
        public CaseStatus Status { get; set; } = CaseStatus.Pending;
        [Required]
        public string PlaintiffName { get; set; } = string.Empty;
        [Required]
        public string AccusedName { get; set; } = string.Empty;
        public string? Subject { get; set; }
        public DateTime FiledAt { get; set; } = DateTime.UtcNow;
        public DateTime? ClosedAt { get; set; }
        [Required]
        public string FiledById { get; set; } = string.Empty;
        public HRUser? FiledBy { get; set; }
        public string? AssignedJudgeId { get; set; }
        public HRUser? AssignedJudge { get; set; }
        public int BusinessUnitId { get; set; }
        public BusinessUnit? BusinessUnit { get; set; }
        public int? ChilotId { get; set; }
        public Chilot? Chilot { get; set; }
        public ICollection<CaseFileDocument> CaseFileDocuments { get; set; } = new List<CaseFileDocument>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public ICollection<Hearing> Hearings { get; set; } = new List<Hearing>();
        public ICollection<Judgment> Judgments { get; set; } = new List<Judgment>();
        public ICollection<CaseTimeline> Timeline { get; set; } = new List<CaseTimeline>();
        public ICollection<JudgeAssignment> JudgeAssignments { get; set; } = new List<JudgeAssignment>();
        public ICollection<CaseTemplate> TemplatesUsed { get; set; } = new List<CaseTemplate>();
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<ChatbotMessage> ChatbotMessages { get; set; } = new List<ChatbotMessage>();
    }
}
