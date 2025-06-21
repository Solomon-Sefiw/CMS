using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using MediatR;

namespace CMS.Application.Features.Addresses.Setups.Commands.UpdateSubCity
{
    public record UpdateSubCityCommand(int Id, string Name, string Description, int RegionId, ApprovalStatus ApprovalStatus) : IRequest<int>;
}
