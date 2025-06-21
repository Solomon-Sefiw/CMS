using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using MediatR;

namespace CMS.Application.Features.Addresses.Commands.UpdateAddress
{
    public record UpdateAddressCommand(
        int Id,
        AddressTypeEnum AddressType,
        CountryEnum Country,
        int? RegionId,
        int? SubCityId,
        string Woreda,
        string City,
        string? Kebele,
        string? HouseNumber,
        int RequestId
    ) : IRequest<int>;

}
