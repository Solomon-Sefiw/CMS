using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BusinessUnits.Commands.RejectBusinessUnit
{
    public class RejectBusinessUnitCommandHandler:IRequestHandler<RejectBusinessUnitCommand,int>
    {
        private readonly IDataService dataService;

        public RejectBusinessUnitCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectBusinessUnitCommand command, CancellationToken cancellationtoken)
        {
            var businessUnit= dataService.BusinessUnits.Where(bu=>bu.Id==command.Id).FirstOrDefault();

            businessUnit.ApprovalStatus = ApprovalStatus.Rejected;
           
            await dataService.SaveAsync(cancellationtoken);
            return businessUnit.Id;
        }
    }
}
