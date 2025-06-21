using CMS.Application.Features.BusinessUnits.Commands.ActivateBusinessUnit;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BusinessUnits.Commands.CloseBusinessUnit
{
    public class DeactivateBusinessUnitCommandHandler : IRequestHandler<DeActiveBusinessUnitCommand, int>
    {
        private readonly IDataService dataService;

        public DeactivateBusinessUnitCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(DeActiveBusinessUnitCommand command, CancellationToken cancellationtoken)
        {
            var businessUnit = dataService.BusinessUnits.Where(bu => bu.Id == command.Id).FirstOrDefault();

            businessUnit.Status = Status.DeActive;

            await dataService.SaveAsync(cancellationtoken);
            return businessUnit.Id;
        }
    }
}
