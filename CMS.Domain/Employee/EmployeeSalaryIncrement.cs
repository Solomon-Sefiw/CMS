using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Employee
{
    public class EmployeeSalaryIncrement
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int JobRoleId { get; set; }
        public JobRole JobRole { get; set; }
        public DateOnly SalaryIncrementDate { get; set; }
        public DateOnly? SalaryIncrementEndDate { get; set; }
        public int BeforeGradeSalaryStepId { get; set; }
        public int AfterGradeSalaryStepId { get; set; }
        public string? Remark { get; set; }
        public EmployeeTransactionStatus? TransactionStatus { get; set; }
    }
}
