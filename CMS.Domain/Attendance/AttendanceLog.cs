using System;
using System.ComponentModel.DataAnnotations;
using CMS.Domain.Employee;
using CMS.Domain.Enums;

namespace CMS.Domain.Attendance
{
    public enum AttendanceSession
    {
        Morning = 0,
        Afternoon = 1
    }

    public enum AttendanceAction
    {
        In = 0,
        Out = 1
    }

    public class AttendanceLog : WorkflowEnabledEntity  // Inherit from your base if needed for approvals
    {
        [Key]
        public int Id { get; set; }

        public int EmployeeId { get; set; }
        public Domain.Employee.Employee? Employee { get; set; }

        public string DeviceSerial { get; set; } = string.Empty;

        public int DeviceStatus { get; set; }  // Raw from device (0=IN,1=OUT)

        public AttendanceSession Session { get; set; }

        public AttendanceAction Action { get; set; }

        public DateTime TimestampUtc { get; set; }

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

        public bool IsManual { get; set; } = false;

        public string? Notes { get; set; }

        public string? CreatedByUserId { get; set; }  // For audit

        // Optional: Link to your Notifications if anomaly detected (e.g., late)
        public int? NotificationId { get; set; }
    }
}