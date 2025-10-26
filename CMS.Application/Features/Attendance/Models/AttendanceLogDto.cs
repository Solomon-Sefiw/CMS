using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Attendance.Models
{
    public class AttendanceLogDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeDisplayName { get; set; } = string.Empty;
        public string DeviceSerial { get; set; } = string.Empty;
        public DateTime TimestampUtc { get; set; }
        public string Session { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public bool IsManual { get; set; }
        public string? Notes { get; set; }
    }
}
