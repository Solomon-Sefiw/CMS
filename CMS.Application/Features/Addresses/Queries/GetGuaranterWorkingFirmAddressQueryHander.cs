using CMS.Application.Features;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetGuaranterWorkingFirmAddressQuery(int? employeeId) : IRequest<List<AddressDto>>;

public class GetGuaranterWorkingFirmAddressQueryHander : IRequestHandler<GetGuaranterWorkingFirmAddressQuery, List<AddressDto>>
{
    private readonly IDataService dataService;

    public GetGuaranterWorkingFirmAddressQueryHander(IDataService dataService)
    {
        this.dataService = dataService;
    }
    public async Task<List<AddressDto>> Handle(GetGuaranterWorkingFirmAddressQuery query, CancellationToken cancellationToken)
    {
        var addresses = await dataService.Addresses
            .Include(a => a.Region)
            .Include(a => a.SubCity)
            .Where(x => x.RequestId == query.employeeId && x.AddressType==AddressTypeEnum.GuaranterWorkingFirmAddress)
            .ToListAsync(cancellationToken); 

        if (addresses == null || !addresses.Any())
        {
            return new List<AddressDto>(); 
        }

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
