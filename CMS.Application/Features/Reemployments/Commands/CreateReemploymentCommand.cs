using CMS.Domain.Enum;
using CMS.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Reemployments.Commands
{
    public class CreateReemploymentCommand : IRequest<int>
    {
        public int EmployeeId { get; set; }
        public ReemploymentType ReemploymentType { get; set; }
        public DateOnly ReemploymentDate { get; set; }
        public string ReasonForReemployment { get; set; }
        public string? Remark { get; set; }
    }
}
