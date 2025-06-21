using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace CMS.Application.Features.Addresses.Setups.SubCity.Commands.ApproveSubCity
{
    public record ApproveSubCityCommand(int Id) : IRequest<int>;

}
