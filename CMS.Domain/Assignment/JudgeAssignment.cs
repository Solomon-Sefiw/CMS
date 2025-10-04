using CMS.Domain.Common;
using CMS.Domain.Courts;
using CMS.Domain.User;
using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.Assignment
{
    public class JudgeAssignment : AuditableEntity
    {
        [Key]
        public int Id { get; set; }
        public string? JudgeId { get; set; }
        public HRUser? Judge { get; set; }
        public int? CaseId { get; set; }
        public CMS.Domain.Cases.Case? Case { get; set; }
        public int? ChilotId { get; set; }
        public Chilot? Chilot { get; set; }
        public int? BusinessUnitId { get; set; }
        public CMS.Domain.BusinessUnit? BusinessUnit { get; set; }
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UnassignedAt { get; set; }
        public string? Role { get; set; }
    }
}
