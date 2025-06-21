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

namespace CMS.Application.Features.Addresses.Setups.Region.Commands.SubmitRegion
{
    public class SubmitRegionCommandHandler : IRequestHandler<SubmitRegionCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitRegionCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(SubmitRegionCommand command, CancellationToken cancellationToken)
        {
            var region = dataService.Regions.Where(r => r.Id == command.Id).FirstOrDefault();

            region.ApprovalStatus = ApprovalStatus.Submitted;
            await dataService.SaveAsync(cancellationToken);
            return region.Id;
        }
    }
}
