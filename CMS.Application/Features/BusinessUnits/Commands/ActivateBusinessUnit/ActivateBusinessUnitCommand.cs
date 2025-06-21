using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace CMS.Application.Features.BusinessUnits.Commands.ActivateBusinessUnit
{
    public class ActivateBusinessUnitCommand : IRequest<int>
    {
        public int Id { get; set; }
    }
}
