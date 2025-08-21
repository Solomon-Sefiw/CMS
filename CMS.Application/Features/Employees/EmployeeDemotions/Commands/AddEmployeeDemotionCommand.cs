using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeDemotions.Commands
{
    public class AddEmployeeDemotionCommand : IRequest<int>
    {
        public int EmployeeId { get; set; }
        public DateOnly DemotionDate { get; set; }
        public DateOnly? DemotionEndDate { get; set; }
        public int JobRoleBeforeId { get; set; }
        public int JobRoleAfterId { get; set; }
        public DemotionType DemotionType { get; set; }
        public int BusinessUnitBeforeId { get; set; }
        public int BusinessUnitAfterId { get; set; }
        public int BeforeGradeSalaryStepId { get; set; }
        public int AfterGradeSalaryStepId { get; set; }
        public string? Remark { get; set; }
        public Boolean IsBusinessUnitChange { get; set; }

        public EmployeeTransactionStatus? TransactionStatus { get; set; }

    }

}
