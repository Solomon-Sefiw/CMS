using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;

namespace CMS.Application.Features.Employees.EmployeePromotions.PromotionModel
{
    public class EmployeePromotionDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public DateOnly PromotionDate { get; set; }
        public DateOnly? PromotionEndDate { get; set; }
        public string JobRoleBefore { get; set; }
        public string JobRoleAfter { get; set; }
        public PromotionType PromotionType { get; set; }
        public string BusinessUnitBefore { get; set; }
        public string BusinessUnitAfter { get; set; }
        public int BeforeGradeSalaryStepId { get; set; }
        public int AfterGradeSalaryStepId { get; set; }
        public string? Remark { get; set; }
        public Boolean IsBusinessUnitChange { get; set; }
        public EmployeeTransactionStatus? TransactionStatus { get; set; }

    }
}
