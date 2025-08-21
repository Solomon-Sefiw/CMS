using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using MediatR;

namespace CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationCommand
{
    public class AddEmployeeReClassificationCommand : IRequest<int>
    {
        public int EmployeeId { get; set; }
        public DateOnly ReClassificationDate { get; set; }
        public DateOnly? ReClassificationEndDate { get; set; }
        public int JobRoleBeforeId { get; set; }
        public int JobRoleAfterId { get; set; }
        public ReClassificationType ReClassificationType { get; set; }
        public string? Remark { get; set; }

        public EmployeeTransactionStatus? TransactionStatus { get; set; }

    }

}
