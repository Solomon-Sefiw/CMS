using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.Attendance
{
    public class Device
    {
        [Key]
        public int Id { get; set; }
        public string SerialNumber { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public string? Location { get; set; }
        public DateTime RegisteredAtUtc { get; set; } = DateTime.UtcNow;
    }
}