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
    public class EmployeeFamily
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employees { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? FatherFullName { get; set; }
        public string? MotherFullName { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public Gender? Gender { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
        public string? WorkingFirm { get; set; }//FatherLivelyhood
        public EmployeeFamilyType familyType { get; set; }   
        public SpouseIsWorking? SpouseIsWorking { get; set; }
        public IsParentLiving? IsParentLiving { get; set; }
        public ParentType? FamilyParentType { get; set; }
        public string? ParentLivelyHood { get; set; }
        public ActivationEnum? IsActive { get; set; }
        public string? comment { get; set; }

    }
}
