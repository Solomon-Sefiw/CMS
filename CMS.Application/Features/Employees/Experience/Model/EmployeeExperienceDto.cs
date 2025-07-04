using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.Experience.Model
{
    public class EmployeeExperienceDto
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
        public string EmployeeName { get; set; }

    }
}
