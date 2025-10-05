using CMS.Domain.Employee;
using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.EmployeeWarning.Models
{
    public record EmployeeWarningDto(
         int Id,
         int EmployeeId,
         Employee Employee,
         double Percentage,
         DateOnly WarningDate,
         WarningStatus WarningStatus,
         ViolationType ViolationType,
         string? Remark,
         ApprovalStatus ApprovalStatus
     );
}
