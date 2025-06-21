using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using CMS.Application.Features.Addresses.Setups.Region.Commands.ApproveRegion;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Addresses.Setups.Region.Commands.RejectRegion
{
    public class RejectRegionCommandHandler : IRequestHandler<RejectRegionCommand, int>
    {
        private readonly IDataService dataService;

        public RejectRegionCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectRegionCommand command, CancellationToken cancellationToken)
        {
            var region = dataService.Regions.Where(r => r.Id == command.Id).FirstOrDefault();

            region.ApprovalStatus = ApprovalStatus.Rejected;
            await dataService.SaveAsync(cancellationToken);
            return region.Id;
        }
    }
}
