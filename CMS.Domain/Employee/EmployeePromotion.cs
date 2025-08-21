using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;

namespace CMS.Domain.Employee
{
    public  class EmployeePromotion
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
        public DateOnly? PromotionDate { get; set; }
        public DateOnly? PromotionEndDate { get; set; }
        public int JobRoleBeforeId { get; set; }
        public JobRole JobRoleBefore { get; set; }
        public int JobRoleAfterId { get; set; }
        public JobRole JobRoleAfter { get; set; }
        public PromotionType PromotionType { get; set; }
        public int BusinessUnitBeforeId { get; set; }
        public BusinessUnit BusinessUnitBefore { get; set; }
        public int BusinessUnitAfterId { get; set; }
        public BusinessUnit BusinessUnitAfter { get; set; }
        public Decimal? SalaryAfter { get; set; }
        public Decimal? SalaryBefore { get; set; }
        public string? Remark { get; set; }
        public int BeforeGradeSalaryStepId { get; set; }
        public int AfterGradeSalaryStepId { get; set; }

        public Boolean IsBusinessUnitChange { get; set; }
        public EmployeeTransactionStatus? TransactionStatus { get; set; }
    }
}
