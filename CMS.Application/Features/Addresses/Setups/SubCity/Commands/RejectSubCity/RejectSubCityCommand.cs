using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace CMS.Application.Features.Addresses.Setups.SubCity.Commands.RejectSubCity
{
    public record RejectSubCityCommand(int Id) : IRequest<int>;
}
