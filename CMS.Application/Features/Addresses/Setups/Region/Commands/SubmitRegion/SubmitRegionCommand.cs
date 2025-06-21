using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace CMS.Application.Features.Addresses.Setups.Region.Commands.SubmitRegion
{
    public record SubmitRegionCommand(int Id) : IRequest<int>;

}
