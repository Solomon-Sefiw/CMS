using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace CMS.Application.Features.Addresses.Setups.Commands.CreateSubCity
{
    public record CreateSubCityCommand(string Name, string Description, int RegionId) : IRequest<int>;
}
