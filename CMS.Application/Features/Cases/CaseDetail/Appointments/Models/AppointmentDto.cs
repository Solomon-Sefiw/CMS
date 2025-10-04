using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Appointments.Models
{
    public class AppointmentDto
    {
        public int Id { get; set; }
        public int CaseId { get; set; }
        public int BusinessUnitId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string? Location { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? ScheduledById { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
    }
}
