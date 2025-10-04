using CMS.Domain.Employee;
using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.Resignations.Models
{
    public record ResignationDto(
           int Id,
           int EmployeeId,
           Employee Employee,
           decimal Salary,
           string WorkUnit,
           DateOnly ResignationDate,
           ResignationType ResignationType,
           string ReasonForResignation,
           string FinalSettlementDetails,
           bool IsActive,
           ICollection<CMS.Domain.EmployeeDocument.EmployeeFileDocument> EmployeeFileDocuments,
           ApprovalStatus ApprovalStatus
       );
}
