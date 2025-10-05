using CMS.Application.Features.Transfer.Model;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Transfer.Queries
{
    public class GetEmployeeWithDetailsQuery : IRequest<EmployeeBasicInfoDto>
    {
        public int EmployeeId { get; set; }
        public GetEmployeeWithDetailsQuery(int employeeId)
        {
            EmployeeId = employeeId;
        }
    }
}
