using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Attendance.Models
{
    public class UpdateDeviceDto
    {
        public bool IsActive { get; set; }
        public string? Location { get; set; }
    }
}
