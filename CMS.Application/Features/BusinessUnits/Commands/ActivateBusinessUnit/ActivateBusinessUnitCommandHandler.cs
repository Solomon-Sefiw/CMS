using CMS.Application.Features.BusinessUnits.Commands.ActivateBusinessUnit;
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
    public class ActivateBusinessUnitCommandHandler : IRequestHandler<ActivateBusinessUnitCommand, int>
    {
        private readonly IDataService dataService;

        public ActivateBusinessUnitCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ActivateBusinessUnitCommand command, CancellationToken cancellationtoken)
        {
            var businessUnit = dataService.BusinessUnits.Where(bu => bu.Id == command.Id).FirstOrDefault();

            businessUnit.Status = Status.Active;

            await dataService.SaveAsync(cancellationtoken);
            return businessUnit.Id;
        }
    }
}
