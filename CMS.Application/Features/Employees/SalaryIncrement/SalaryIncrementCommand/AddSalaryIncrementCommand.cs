using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using MediatR;

namespace CMS.Application.Features.Employees.SalaryIncrement.SalaryIncrementCommand
{
    public class AddSalaryIncrementCommand : IRequest<int>
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int JobRoleId { get; set; }
        public DateOnly SalaryIncrementDate { get; set; }
        public DateOnly? SalaryIncrementEndDate { get; set; }
        public int BeforeGradeSalaryStepId { get; set; }
        public int AfterGradeSalaryStepId { get; set; }
        public string? Remark { get; set; }
        public EmployeeTransactionStatus? TransactionStatus { get; set; }

    }

}
