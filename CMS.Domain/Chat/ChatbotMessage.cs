using CMS.Domain.Common;
using CMS.Domain.User;
using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.Chat
{
    public class ChatbotMessage : AuditableEntity
    {
        [Key]
        public int Id { get; set; }
        public int CaseId { get; set; }
        public CMS.Domain.Cases.Case? Case { get; set; }
        public string SenderId { get; set; } = string.Empty;
        public HRUser? Sender { get; set; }
        public string? ReceiverId { get; set; }
        public HRUser? Receiver { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Response { get; set; }
        public bool Seen { get; set; } = false;
        public bool IsSystem { get; set; } = false;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
