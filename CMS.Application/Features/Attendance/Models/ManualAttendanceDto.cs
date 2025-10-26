using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Attendance.Models
{
    public class ManualAttendanceDto
    {
        public int EmployeeId { get; set; }
        public DateTime TimestampUtc { get; set; }
        public string? DeviceSerial { get; set; } = "MANUAL";
        public string Notes { get; set; } = string.Empty;
        public bool ForceOut { get; set; } = false;
    }
}
