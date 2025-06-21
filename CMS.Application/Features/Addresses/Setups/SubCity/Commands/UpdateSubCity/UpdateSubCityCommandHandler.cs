using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Exceptions;
using CMS.Application.Features.Addresses.Setups.Commands.UpdateSubCity;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Addresses.Setups.SubCity.Commands.UpdateSubCity
{
    public class UpdateSubCityCommandHandler : IRequestHandler<UpdateSubCityCommand,int>
    {
        private readonly IDataService dataService;

        public UpdateSubCityCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(UpdateSubCityCommand command, CancellationToken cancellationToken)
        {
            var subCity = await dataService.SubCities.FindAsync(command.Id);

            subCity.Name = command.Name;
            subCity.Description = command.Description;
            subCity.RegionId = command.RegionId;
            subCity.ApprovalStatus = Domain.Enum.ApprovalStatus.Draft;

            await dataService.SaveAsync(cancellationToken);

            return subCity.Id;
        }
    }

}
