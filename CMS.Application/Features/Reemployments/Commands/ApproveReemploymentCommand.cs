using CMS.Application.Features.Employees;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Reemployments.Commands
{
    public class ApproveReemploymentCommand : IRequest<int>
    {
        public int ReemploymentId { get; set; }
        public string? Remark { get; set; }

        // Only used when Rehire
        public CreateEmployeeProfileCommand? NewEmployeeProfile { get; set; }
    }
}
