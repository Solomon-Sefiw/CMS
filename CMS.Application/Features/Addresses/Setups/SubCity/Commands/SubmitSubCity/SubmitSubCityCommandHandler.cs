using CMS.Application.Features.Addresses.Setups.SubCity.Commands.SubmitSubCity;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Addresses.Setups.SubCity.Commands.RejectSubCity
{
    public class SubmitSubCityCommandHandler : IRequestHandler<SubmitSubCityCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitSubCityCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(SubmitSubCityCommand command, CancellationToken cancellationToken)
        {
            var subCity = dataService.SubCities.Where(r => r.Id == command.Id).FirstOrDefault();

            subCity.ApprovalStatus = ApprovalStatus.Submitted;
            await dataService.SaveAsync(cancellationToken);
            return subCity.Id;
        }
    }
}
