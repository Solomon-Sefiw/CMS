using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace CMS.Application.Features.Addresses.Setups.Region.Commands.RejectRegion
{
    public record RejectRegionCommand(int Id) : IRequest<int>;
}
