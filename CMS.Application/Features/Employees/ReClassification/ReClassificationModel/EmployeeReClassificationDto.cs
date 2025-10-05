using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;

namespace CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationModel
{
    public class EmployeeReClassificationDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public DateOnly ReClassificationDate { get; set; }
        public DateOnly? ReClassificationEndDate { get; set; }
        public string JobRoleBefore { get; set; }
        public string JobRoleAfter { get; set; }
        public ReClassificationType ReClassificationType { get; set; }
     /*   public string BusinessUnitBefore { get; set; }
        public string BusinessUnitAfter { get; set; }
        public int BeforeGradeSalaryStepId { get; set; }
        public int AfterGradeSalaryStepId { get; set; }
        public Boolean IsBusinessUnitChange { get; set; }
     **/
        public string? Remark { get; set; }
        public EmployeeTransactionStatus? TransactionStatus { get; set; }

    }
}
