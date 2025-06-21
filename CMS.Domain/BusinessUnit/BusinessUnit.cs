

using System.ComponentModel.DataAnnotations;
using CMS.Domain.Enum;


namespace CMS.Domain
{
    public class BusinessUnit
    {
        [Key]
        public int Id { get; set; }
        public string BusinessUnitID { get; set; }
        public string Name { get; set; }
        public int ParentId { get; set; }
        public BusinessUnitTypeEnum Type { get; set; }
        public string? BusinessUnitCode { get; set; }
        public int? StaffStrength { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;
        public Status Status { get; set; } = Status.Active;
        public BusinessUnitType BusinessUnitType { get; set; }

    }
}
