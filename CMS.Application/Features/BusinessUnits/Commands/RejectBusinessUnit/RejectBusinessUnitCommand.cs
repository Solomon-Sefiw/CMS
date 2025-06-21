using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BusinessUnits.Commands.RejectBusinessUnit
{
    public class RejectBusinessUnitCommand:IRequest<int>
    {
        public int Id { get; set; }
    }
}
