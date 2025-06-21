using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace CMS.Application.Features.Addresses.Setups.Commands.CreateRegion
{
    public record CreateRegionCommand(string Name, string Description) : IRequest<int>;
}

