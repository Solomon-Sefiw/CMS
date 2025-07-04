using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.Award.Commands.RejectAward
{
    public record RejectAwardCommand(int Id) : IRequest<int>;

    public class RejectAwardCommandHandler : IRequestHandler<RejectAwardCommand, int>
    {
        private readonly IDataService dataService;

        public RejectAwardCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectAwardCommand command, CancellationToken cancellationToken)
        {
            var award = dataService.Awards.Where(r => r.Id == command.Id).FirstOrDefault();

            award.ApprovalStatus = ApprovalStatus.Rejected;
            await dataService.SaveAsync(cancellationToken);
            return award.Id;
        }
    }
}
