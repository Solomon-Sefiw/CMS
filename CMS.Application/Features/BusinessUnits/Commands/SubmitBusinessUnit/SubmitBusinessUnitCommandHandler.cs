using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BusinessUnits.Commands.SubmitBusinessUnit
{
    public class SubmitBusinessUnitCommandHandler:IRequestHandler<SubmitBusinessUnitCommand,int>
    {
        private readonly IDataService dataService;

        public SubmitBusinessUnitCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(SubmitBusinessUnitCommand command, CancellationToken cancellationtoken)
        {
            var businessUnit= dataService.BusinessUnits.Where(bu=>bu.Id==command.Id).FirstOrDefault();

            businessUnit.ApprovalStatus = ApprovalStatus.Submitted;

            await dataService.SaveAsync(cancellationtoken);
            return businessUnit.Id;
        }
    }
}
