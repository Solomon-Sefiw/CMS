using CMS.Domain.Enum;
using CMS.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Reemployments.Model
{
    public class ReemploymentDto
    {
        public int Id { get; set; } 

        public int EmployeeId { get; set; } 
        public string EmployeeName { get; set; }
        public string? EmployeeFirstName { get; set; }
        public string? EmployeeMiddleName { get; set; }
        public string? EmployeeLastName { get; set; }
        public string? AmharicFirstName { get; set; }
        public string? AmharicMiddleName { get; set; }
        public string? AmharicLastName { get; set; }
        public DateOnly? BirthDate { get; set; }
        public DateOnly? EmployementDate { get; set; }
        public Gender? Gender { get; set; }
        public MartialStatus? MartialStatus { get; set; }
        public string BusinessUnitName { get; set; }
        public string JobRoleName { get; set; }
        public int BusinessUnitId { get; set; }
        public int JobId { get; set; }
        public ReemploymentType ReemploymentType { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
        public DateOnly ReemploymentDate { get; set; }
        public string ReasonForReemployment { get; set; }
        public string? Remark { get; set; }
    }

}
