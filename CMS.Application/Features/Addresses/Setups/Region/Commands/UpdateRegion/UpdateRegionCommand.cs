using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace CMS.Application.Features.Addresses.Setups.Commands.UpdateRegion
{
    public record UpdateRegionCommand(int Id, string Name, string Description) : IRequest<int>;

}
