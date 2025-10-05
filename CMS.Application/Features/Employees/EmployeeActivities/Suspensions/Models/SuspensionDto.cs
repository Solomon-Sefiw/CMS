using CMS.Domain.Employee;
using CMS.Domain.Enum;

namespace CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Models
{
    public record SuspensionDto(
          int Id,
          int EmployeeId,
          Employee Employee,
          DateOnly StartDate,
          DateOnly? EndDate,
          decimal Salary,
          SuspensionReason Reason,
          string Description,
          string ConditionsForReinstatement,
          bool IsActive,
          ICollection<CMS.Domain.EmployeeDocument.EmployeeFileDocument> EmployeeFileDocuments,
          ApprovalStatus ApprovalStatus
      );
}
