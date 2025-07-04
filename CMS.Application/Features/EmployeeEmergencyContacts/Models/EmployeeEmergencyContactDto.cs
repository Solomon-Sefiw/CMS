using CMS.Application.Features.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.EmployeeEmergencyContacts.Models
{
    public class EmployeeEmergencyContactDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string DisplayName => $"{Name} {MiddleName} {LastName}".Trim();

        public bool IsWorking { get; set; }
        public string WorkingFirmName { get; set; }
        public int EmployeeId { get; set; }
    }
}
