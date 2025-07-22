using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain;
using CMS.Domain.Employee;
using CMS.Domain.Enum;

namespace CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Models
{

    public record DelegationDto(
        int Id,
        int EmployeeId,
        Employee Employee,
        int JobRoleId,
        JobRole JobRole,
        int? BusinessUnitId,
        BusinessUnit BusinessUnit,
        DateOnly StartDate,
        DateOnly? EndDate,
        ApprovalStatus ApprovalStatus
    );


}
