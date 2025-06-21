using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace CMS.Application.Features.Addresses.Setups.Region.Commands.ApproveRegion
{
    public class ApproveRegionCommandHandler : IRequestHandler<ApproveRegionCommand, int>
    {
        private readonly IDataService dataService;

        public ApproveRegionCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ApproveRegionCommand command, CancellationToken cancellationToken)
        {
            var region = dataService.Regions.Where(r => r.Id == command.Id).FirstOrDefault();

            region.ApprovalStatus = ApprovalStatus.Approved;
            await dataService.SaveAsync(cancellationToken);
            return region.Id;
        }
    }
}
