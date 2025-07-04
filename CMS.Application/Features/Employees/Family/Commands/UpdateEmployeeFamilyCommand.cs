using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using MediatR;
using System.ComponentModel.DataAnnotations;

namespace CMS.Application.Features.Employees.Family.Commands
{
    public class UpdateEmployeeFamilyCommand: IRequest<int>
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public Decimal? Age { get; set; }
        public string? FatherFullName { get; set; }
        public string? MotherFullName { get; set; }
        public Gender? Gender { get; set; }
        public string? WorkingFirm { get; set; }//FatherLivelyhoo
        public EmployeeFamilyType FamilyType { get; set; }
        public SpouseIsWorking? SpouseIsWorking { get; set; }
        public IsParentLiving? IsParentLiving { get; set; }
        public ParentType? FamilyParentType { get; set; }
        public string? ParentLivelyHood { get; set; }

        public ActivationEnum IsActive { get; set; }
        public string? comment { get; set; }
    }
}
