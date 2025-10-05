using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;

namespace CMS.Application.Features.Employees.SalaryIncrement.SalaryIncrementModel
{
    public class EmployeeSalaryIncrementDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string JobRole { get; set; }
        public JobGradeRomanId Grade { get; set; }
        public DateOnly SalaryIncrementDate { get; set; }
        public DateOnly? SalaryIncrementEndDate { get; set; }
        public int BeforeGradeSalaryStepId { get; set; }
        public int AfterGradeSalaryStepId { get; set; }
        public string? Remark { get; set; }
        public EmployeeTransactionStatus? TransactionStatus { get; set; }

    }
}
