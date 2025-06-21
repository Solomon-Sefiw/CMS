using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace CMS.Application.Features.BusinessUnits.Commands.CloseBusinessUnit
{
    public class DeActiveBusinessUnitCommand : IRequest<int>
    {
        public int Id { get; set; }
    }
}
