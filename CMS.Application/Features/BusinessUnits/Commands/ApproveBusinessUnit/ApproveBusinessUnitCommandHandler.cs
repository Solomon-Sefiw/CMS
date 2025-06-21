using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BusinessUnits.Commands.ApproveBusinessUnit
{
    public class ApproveBusinessUnitCommandHandler:IRequestHandler<ApproveBusinessUnitCommand,int>
    {
        private readonly IDataService dataService;

        public ApproveBusinessUnitCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ApproveBusinessUnitCommand command, CancellationToken cancellationtoken)
        {
            var businessUnit= dataService.BusinessUnits.Where(bu=>bu.Id==command.Id).FirstOrDefault();

            businessUnit.ApprovalStatus = ApprovalStatus.Approved;

            await dataService.SaveAsync(cancellationtoken);
            return businessUnit.Id;
        }
    }
}
