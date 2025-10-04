using CMS.Domain.Appointments;
using CMS.Domain.Assignment;
using CMS.Domain.Cases;
using CMS.Domain.Courts;
using CMS.Domain.Enum;
using System.ComponentModel.DataAnnotations;


namespace CMS.Domain
{
    public class BusinessUnit
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string BusinessUnitID { get; set; } = string.Empty;
        [Required]
        public string Name { get; set; } = string.Empty;
        public int ParentId { get; set; }
        public BusinessUnitTypeEnum Type { get; set; } 
        public string? BusinessUnitCode { get; set; }
        public int? StaffStrength { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;
        public Status Status { get; set; } = Status.Active;
        public BusinessUnitType BusinessUnitType { get; set; } 

        public CourtLevel? CourtLevel { get; set; }
        public string? CourtCode { get; set; }
        public string? Location { get; set; }
        public string? Address { get; set; }
     //   public bool IsCourt => Type == BusinessUnitTypeEnum.Court;

        public ICollection<Chilot> Chillots { get; set; } = new List<Chilot>();
        public ICollection<Case> Cases { get; set; } = new List<Case>();
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<JudgeAssignment> JudgeAssignments { get; set; } = new List<JudgeAssignment>();
    }
}
