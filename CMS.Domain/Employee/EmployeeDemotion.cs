using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;

namespace CMS.Domain.Employee
{
    public  class EmployeeDemotion
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
        public DateOnly? DemotionDate { get; set; }
        public DateOnly? DemotionEndDate { get; set; }
        public int JobRoleBeforeId { get; set; }
        public JobRole JobRoleBefore { get; set; }
        public int JobRoleAfterId { get; set; }
        public JobRole JobRoleAfter { get; set; }
        public DemotionType DemotionType { get; set; }
        public int BusinessUnitBeforeId { get; set; }
        public BusinessUnit BusinessUnitBefore { get; set; }
        public int BusinessUnitAfterId { get; set; }
        public BusinessUnit BusinessUnitAfter { get; set; }
        public int BeforeGradeSalaryStepId { get; set; }
        public int AfterGradeSalaryStepId { get; set; }
        public string? Remark { get; set; }
        public Boolean IsBusinessUnitChange { get; set; }
        public EmployeeTransactionStatus? TransactionStatus { get; set; }
    }
}
