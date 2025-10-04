using CMS.Domain.Common;
using CMS.Domain.User;
using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.Templates
{
    public class CaseTemplate : AuditableEntity
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? CreatedById { get; set; }
        public HRUser? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
