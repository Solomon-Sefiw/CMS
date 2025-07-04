using CMS.Domain.Adress;
using CMS.Domain.Contacts;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Employee
{
    public class EmployeeEmergencyContact
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
