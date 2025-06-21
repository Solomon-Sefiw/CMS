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

namespace CMS.Application.Features.Addresses.Setups.SubCity.Commands.ApproveSubCity
{
    public class ApproveSubCityCommandHandler : IRequestHandler<ApproveSubCityCommand, int>
    {
        private readonly IDataService dataService;

        public ApproveSubCityCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ApproveSubCityCommand command, CancellationToken cancellationToken)
        {
            var subCity = dataService.SubCities.Where(r => r.Id == command.Id).FirstOrDefault();

            subCity.ApprovalStatus = ApprovalStatus.Approved;
            await dataService.SaveAsync(cancellationToken);
            return subCity.Id;
        }
    }
}
