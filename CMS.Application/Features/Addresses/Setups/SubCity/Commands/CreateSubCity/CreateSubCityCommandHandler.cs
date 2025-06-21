using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Adress;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Addresses.Setups.Commands.CreateSubCity
{
    public class CreateSubCityCommandHandler : IRequestHandler<CreateSubCityCommand, int>
    {
        private readonly IDataService dataService;

        public CreateSubCityCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(CreateSubCityCommand command, CancellationToken cancellationToken)
        {
            var subCity = new Domain.Adress.SubCity
            {
                Name = command.Name,
                Description = command.Description,
                RegionId = command.RegionId
            };

            dataService.SubCities.Add(subCity);
            await dataService.SaveAsync(cancellationToken);

            return subCity.Id;
        }
    }

}
