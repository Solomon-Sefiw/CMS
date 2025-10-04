using CMS.Domain.Common;
using CMS.Domain.Enum;
using CMS.Domain.User;
using System.ComponentModel.DataAnnotations;
namespace CMS.Domain.Appointments
{
    public class Appointment : AuditableEntity
    {
        [Key]
        public int Id { get; set; }
        public int CaseId { get; set; }
        public CMS.Domain.Cases.Case? Case { get; set; }
        public int BusinessUnitId { get; set; }
        public CMS.Domain.BusinessUnit? BusinessUnit { get; set; }
        public DateTime AppointmentDate { get; set; }
        [Required]
        public string Subject { get; set; } = string.Empty;
        public string? Location { get; set; }
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
        public string? ScheduledById { get; set; }
        public HRUser? ScheduledBy { get; set; }
        public string? Notes { get; set; }
    }
}
