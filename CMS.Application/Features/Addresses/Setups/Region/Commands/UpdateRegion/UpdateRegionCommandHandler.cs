using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Exceptions;
using CMS.Application.Features.Addresses.Setups.Commands.UpdateRegion;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Addresses.Setups.Region.Commands.UpdateRegion
{
    public class UpdateRegionCommandHandler : IRequestHandler<UpdateRegionCommand,int>
    {
        private readonly IDataService dataService;

        public UpdateRegionCommandHandler(IDataService dataService)
        {
           this.dataService = dataService;
        }

        public async Task<int> Handle(UpdateRegionCommand command, CancellationToken cancellationToken)
        {
            var region = await dataService.Regions.FindAsync(command.Id);

            if (region == null)
                throw new NotFoundException(nameof(Region), command.Id);

            region.Name = command.Name;
            region.Description = command.Description;
            region.ApprovalStatus = Domain.Enum.ApprovalStatus.Draft;

            await dataService.SaveAsync(cancellationToken);

            return region.Id;
        }
    }

}
