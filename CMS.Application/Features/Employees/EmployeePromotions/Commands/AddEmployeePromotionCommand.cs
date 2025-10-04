using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeePromotions.Commands
{
    public class AddEmployeePromotionCommand : IRequest<int>
    {
        public int EmployeeId { get; set; }
        public DateOnly PromotionDate { get; set; }
        public DateOnly? PromotionEndDate { get; set; }
        public int JobRoleBeforeId { get; set; }
        public int JobRoleAfterId { get; set; }
        public PromotionType PromotionType { get; set; }
        public int BusinessUnitBeforeId { get; set; }
        public int BusinessUnitAfterId { get; set; }
        public int BeforeGradeSalaryStepId { get; set; }
        public int AfterGradeSalaryStepId { get; set; }
        public string? Remark { get; set; }
        public Boolean IsBusinessUnitChange { get; set; }

        public EmployeeTransactionStatus? TransactionStatus { get; set; }

    }

}
