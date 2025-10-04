using CMS.Domain.Assignment;
using CMS.Domain.Cases;
using CMS.Domain.Common;
using CMS.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.Courts
{
    public class Chilot : AuditableEntity
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ChilotType ChilotType { get; set; } = ChilotType.Wonjel;
        public string? RoomNumber { get; set; }
        public int BusinessUnitId { get; set; }
        public CMS.Domain.BusinessUnit? BusinessUnit { get; set; }
        public ICollection<JudgeAssignment> JudgeAssignments { get; set; } = new List<JudgeAssignment>();
        public ICollection<Case> Cases { get; set; } = new List<Case>();
    }
}
