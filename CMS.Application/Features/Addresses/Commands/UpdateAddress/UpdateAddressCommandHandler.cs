using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Addresses.Commands.UpdateAddress
{
    public class UpdateAddressCommandHandler : IRequestHandler<UpdateAddressCommand,int>
    {
        private readonly IDataService dataService;

        public UpdateAddressCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(UpdateAddressCommand command, CancellationToken cancellationToken)
        {
            var address = await dataService.Addresses.FindAsync(command.Id);
            address.AddressType = command.AddressType;
            address.Country = command.Country;
            address.RegionId = command.RegionId;
            address.SubCityId = command.SubCityId;
            address.Woreda = command.Woreda;
            address.City = command.City;
            address.Kebele = command.Kebele;
            address.HouseNumber = command.HouseNumber;
            address.RegisteredOn = DateTime.UtcNow;
            address.RequestId = command.RequestId;
            await dataService.SaveAsync(cancellationToken);

            return address.Id;
        }
    }

}
