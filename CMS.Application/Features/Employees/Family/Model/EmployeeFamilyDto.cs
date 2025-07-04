using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.Family.Model
{
    public class EmployeeFamilyDto
    {
        public int Id { get; set; }
        public string EmployeeName { get; set; }
        public string? FullName { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? FatherFullName { get; set; }
        public string? MotherFullName { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public Decimal? Age { get; set; }
        public string? Gender { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
        public string? WorkingFirm { get; set; }//FatherLivelyhood
        public EmployeeFamilyType familyType { get; set; }

        public SpouseIsWorking? SpouseIsWorking { get; set; }
        public IsParentLiving? IsParentLiving { get; set; }
        public ParentType? FamilyParentType { get; set; }
        public string? ParentLivelyHood { get; set; }

        public ActivationEnum IsActive { get; set; }

        public string? comment { get; set; }

        public int EmployeeId { get; set; }

    }
}
