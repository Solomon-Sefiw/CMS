using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace CMS.Application.Features.Addresses.Setups.Region.Commands.ApproveRegion
{
    public record ApproveRegionCommand(int Id) : IRequest<int>;
}
