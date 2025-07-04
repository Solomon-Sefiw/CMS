using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.Award.Commands.ApproveAward
{
    public record ApproveAwardCommand(int Id) : IRequest<int>;

    public class ApproveAwardCommandHandler : IRequestHandler<ApproveAwardCommand, int>
    {
        private readonly IDataService dataService;

        public ApproveAwardCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ApproveAwardCommand command, CancellationToken cancellationToken)
        {
            var award = dataService.Awards.Where(r => r.Id == command.Id).FirstOrDefault();

            award.ApprovalStatus = ApprovalStatus.Approved;
            await dataService.SaveAsync(cancellationToken);
            return award.Id;
        }
    }
}
