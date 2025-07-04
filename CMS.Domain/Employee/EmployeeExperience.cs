using CMS.Domain.Enum;
using CMS.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Net.Cache;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace CMS.Domain.Employee
{
    public class EmployeeExperience
    {
        public int Id { get; set; }
        public string FirmName { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string JobTitle { get; set; }
        public string City { get; set; }
        public decimal LastSalary { get; set; }
        public string ReasonForResignation { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }

    }
}
