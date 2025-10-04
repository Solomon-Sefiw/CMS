using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Reemployments.Commands
{
    public class SubmitReemploymentCommand : IRequest<int>
    {
        public int ReemploymentId { get; set; }
        public string? Remark { get; set; }
    }
}
