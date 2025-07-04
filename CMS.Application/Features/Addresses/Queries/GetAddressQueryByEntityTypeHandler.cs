using CMS.Application.Features;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetAddressQueryByEntityType(int? employeeId) : IRequest<List<AddressDto>>;

public class GetAddressQueryByEntityTypeHandler : IRequestHandler<GetAddressQueryByEntityType, List<AddressDto>>
{
    private readonly IDataService dataService;

    public GetAddressQueryByEntityTypeHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task<List<AddressDto>> Handle(GetAddressQueryByEntityType query, CancellationToken cancellationToken)
    {
        var addresses = await dataService.Addresses
     .Include(a => a.Region)
     .Include(a => a.SubCity)
     .Where(x => x.RequestId == query.employeeId &&
                 (x.AddressType == AddressTypeEnum.ParentAddress || x.AddressType == AddressTypeEnum.SpouseAddress))
     .ToListAsync(cancellationToken);

        if (addresses == null || !addresses.Any())
        {
            return new List<AddressDto>(); // Return an empty list if no addresses are found.
        }

        // Map the addresses to AddressDto objects.
        var addressDtos = addresses.Select(address => new AddressDto(
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
        )).ToList();

        return addressDtos;
    }

}
