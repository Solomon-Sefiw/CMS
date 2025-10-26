using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Attendance.Models
{
    public class DailyAttendanceSummaryDto
    {
        public DateOnly Date { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeDisplayName { get; set; } = string.Empty;
        public TimeOnly? MorningIn { get; set; }
        public TimeOnly? MorningOut { get; set; }
        public TimeOnly? AfternoonIn { get; set; }
        public TimeOnly? AfternoonOut { get; set; }
        public TimeSpan TotalHours { get; set; }
        public TimeSpan LateMinutes { get; set; }
        public TimeSpan EarlyLeaveMinutes { get; set; }
        public bool IsAbsent { get; set; }
    }
}
