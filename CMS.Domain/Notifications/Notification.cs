using CMS.Domain.Common;
using CMS.Domain.Enum;
using CMS.Domain.User;
using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.Notifications
{
    public class Notification : AuditableEntity
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public HRUser? User { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? Body { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public int? CaseId { get; set; }
        public int? PaymentId { get; set; }
        public int? HearingId { get; set; }
        public NotificationChannel Channel { get; set; } = NotificationChannel.InApp;
    }
}
