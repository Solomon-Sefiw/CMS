using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BusinessUnits.Commands.ApproveBusinessUnit
{
    public class ApproveBusinessUnitCommand:IRequest<int>
    {
        public int Id { get; set; }
    }
}
