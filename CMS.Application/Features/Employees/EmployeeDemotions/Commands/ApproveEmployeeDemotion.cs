using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeDemotions.Commands
{
    public class ApproveEmployeeDemotion:IRequest<int>
    {
        public int Id { get; set; }
        public int employeeId { get; set; }
        public string? remark { get; set; }
    }
}
