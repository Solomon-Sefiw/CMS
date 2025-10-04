using CMS.Domain.Common;
using CMS.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.Courts
{
    public class Court : AuditableEntity
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string CourtName { get; set; } = string.Empty;
        public CourtLevel CourtLevel { get; set; } = CourtLevel.Woreda;
        public string? Code { get; set; }
        public string? Location { get; set; }
        public ICollection<Chilot> Chillots { get; set; } = new List<Chilot>();
        public ICollection<CMS.Domain.Cases.Case> Cases { get; set; } = new List<CMS.Domain.Cases.Case>();
    }
}
