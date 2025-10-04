using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationCommand
{
    public class RejectEmployeeReClassification : IRequest<int>
    {
        public int  Id { get; set; }
        public int  employeeId { get; set; }
       public string? remark { get; set; }
    }
}
