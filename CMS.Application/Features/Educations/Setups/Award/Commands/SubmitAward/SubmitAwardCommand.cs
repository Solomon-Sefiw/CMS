using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Education.awards;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.Award.Commands.SubmitAward
{
    public record SubmitAwardCommand(int Id) : IRequest<int>;

    public class SubmitAwardCommandHandler : IRequestHandler<SubmitAwardCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitAwardCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(SubmitAwardCommand command, CancellationToken cancellationToken)
        {
            var award = dataService.Awards.Where(r => r.Id == command.Id).FirstOrDefault();

            award.ApprovalStatus = ApprovalStatus.Submitted;
            await dataService.SaveAsync(cancellationToken);
            return award.Id;
        }
    }
}
