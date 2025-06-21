
using AutoMapper;
using CMS.Domain;
using CMS.Domain.Adress;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Addresses.Commands.CreateAddress
{
    public record CreateAddressCommand(
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

    public class CreateAddressCommandHandler : IRequestHandler<CreateAddressCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public CreateAddressCommandHandler(IDataService  dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<int> Handle(CreateAddressCommand command, CancellationToken cancellationToken)
        {
            var address = new Address
            {
                AddressType = command.AddressType,
                Country = command.Country,
                RegionId = command.RegionId,
                SubCityId = command.SubCityId,
                Woreda = command.Woreda,
                City = command.City,
                Kebele = command.Kebele,
                HouseNumber = command.HouseNumber,
                RegisteredOn = DateTime.UtcNow,
                RequestId = command.RequestId
            };
           await dataService.Addresses.AddAsync(address);
            await dataService.SaveAsync(cancellationToken);
            return address.Id;
        }
    }

}
