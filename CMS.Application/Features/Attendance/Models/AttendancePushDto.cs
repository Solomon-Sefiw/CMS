using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Attendance.Models
{
    public class AttendancePushDto
    {
        public string DeviceSerial { get; set; } = string.Empty;
        public string EmpCode { get; set; } = string.Empty;  // Maps to Employee.Id or custom code
        public string Status { get; set; } = "0";  // "0" IN, "1" OUT
        public string Timestamp { get; set; } = string.Empty;  // e.g., "2025-10-24 08:33:12"
    }
}
