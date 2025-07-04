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
    public class EmployeeGuranters
    {
        public int Id { get; set; }
        public string IdentificationCardNo { get; set; }
        public string Name { get; set; }
        public string FathersName { get; set; }
        public string GrandfathersName { get; set; }
        public string WorkingFirm { get; set; }
        public int EmployeeId { get; set; }
        public Employee employee { get; set; }
        //

        public string? Referenceno { get; set; }
        public decimal? Salary { get; set; }
        public Guarantee? GuaranteeType { get; set; }

        public ActivationEnum? Active { get; set; }
        public DateOnly? FromDate { get; set; }
        public DateOnly? ToDate { get; set; }
        public string? comment { get; set; }



    }
}
