using CMS.Application.Features;
using CMS.Domain.Adress;

using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetAddressQueryById(int? addressId) : IRequest<List<AddressDto>>;

public class GetAddressQueryByIdHandler : IRequestHandler<GetAddressQueryById, List<AddressDto>>
{
    private readonly IDataService dataService;

    public GetAddressQueryByIdHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task<List<AddressDto>> Handle(GetAddressQueryById query, CancellationToken cancellationToken)
    {
        // Fetch addresses for the given employeeId, including related Region, SubCity, and BusinessUnit.
        var addresses = await dataService.Addresses
            .Include(a => a.Region)
            .Include(a => a.SubCity)
            .Where(x => x.Id == query.addressId)
            .ToListAsync(cancellationToken); // Pass the cancellation token for better task management.

  
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
