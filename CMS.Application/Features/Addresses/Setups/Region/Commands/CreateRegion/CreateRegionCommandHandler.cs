using CMS.Domain.Adress;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Addresses.Setups.Commands.CreateRegion
{
    public class CreateRegionCommandHandler : IRequestHandler<CreateRegionCommand, int>
    {
        private readonly IDataService dataService;

        public CreateRegionCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(CreateRegionCommand command, CancellationToken cancellationToken)
        {
            var region = new Domain.Adress.Region
            {
                Name = command.Name,
                Description = command.Description
            };

            dataService.Regions.Add(region);
            await dataService.SaveAsync(cancellationToken);

            return region.Id;
        }
    }

}
