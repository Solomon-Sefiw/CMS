using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Cases.CaseDetail.Chilot.Commands.RejectChilot
{
    public record RejectChilotCommand(int Id) : IRequest<int>;

    public class RejectChilotCommandHandler : IRequestHandler<RejectChilotCommand, int>
    {
        private readonly IDataService dataService;

        public RejectChilotCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectChilotCommand command, CancellationToken cancellationToken)
        {
            var award = dataService.Chillots.Where(r => r.Id == command.Id).FirstOrDefault();

            award.ApprovalStatus = ApprovalStatus.Rejected;
            await dataService.SaveAsync(cancellationToken);
            return award.Id;
        }
    }
}
