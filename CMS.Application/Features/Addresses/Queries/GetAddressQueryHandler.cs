using CMS.Application.Features;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetAddressesQuery(int RequestId,AddressTypeEnum addressType) : IRequest<AddressDto>;

public class GetAddressesQueryHandler : IRequestHandler<GetAddressesQuery, AddressDto>
{
    private readonly IDataService dataService;

    public GetAddressesQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task<AddressDto> Handle(GetAddressesQuery query, CancellationToken cancellationToken)
    {
       var addresses =  await dataService.Addresses
            .Include(a => a.Region)
            .Include(a => a.SubCity)
            //.Include(a => a.BusinessUnit)
            .Where(x => x.RequestId == query.RequestId && x.AddressType == query.addressType)
            .ToListAsync();

#pragma warning disable CS8603 // Possible null reference return.
        return addresses.Select(address => new AddressDto(
            address.Id,
            address.AddressType,
            address.Country,
            address.RegionId,
            address.Region?.Name,
            address.SubCityId,
            address.SubCity?.Name,
            address.Woreda,
            address.City,
            address.Kebele,
            address.HouseNumber,
            address.RequestId,
            address.RegisteredOn
        )).FirstOrDefault();
#pragma warning restore CS8603 // Possible null reference return.

    }
}
