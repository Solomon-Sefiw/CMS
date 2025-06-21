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

namespace CMS.Application.Features.Addresses.Setups.SubCity.Commands.RejectSubCity
{
    public class RejectSubCityCommandHandler : IRequestHandler<RejectSubCityCommand, int>
    {
        private readonly IDataService dataService;

        public RejectSubCityCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectSubCityCommand command, CancellationToken cancellationToken)
        {
            var subCity = dataService.SubCities.Where(r => r.Id == command.Id).FirstOrDefault();

            subCity.ApprovalStatus = ApprovalStatus.Rejected;
            await dataService.SaveAsync(cancellationToken);
            return subCity.Id;
        }
    }
}
