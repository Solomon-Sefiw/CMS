using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Domain;
using CMS.Domain.Employee;

namespace CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Models
{
    public record ActingDto(
    int Id,
    int EmployeeId,
    Employee Employee,
    int JobRoleId,
    JobRole JobRole,
    int? BusinessUnitId,
    BusinessUnit BusinessUnit,
    DateOnly StartDate,
    DateOnly? EndDate,
    ApprovalStatus ApprovalStatus,
    ActingType ActingType,
    int? PreviousJobRoleId,
    JobRole? PreviousJobRole,
    int? PreviousBusinessUnitId,
    BusinessUnit? PreviousBusinessUnit,
    bool IsActive
);
}