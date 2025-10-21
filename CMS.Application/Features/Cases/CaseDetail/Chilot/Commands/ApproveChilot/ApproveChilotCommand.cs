using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Cases.CaseDetail.Chilot.Commands.ApproveChilot
{
    public record ApproveChilotCommand(int Id) : IRequest<int>;

    public class ApproveChilotCommandHandler : IRequestHandler<ApproveChilotCommand, int>
    {
        private readonly IDataService dataService;

        public ApproveChilotCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ApproveChilotCommand command, CancellationToken cancellationToken)
        {
            var award = dataService.Chillots.Where(r => r.Id == command.Id).FirstOrDefault();

            award.ApprovalStatus = ApprovalStatus.Approved;
            await dataService.SaveAsync(cancellationToken);
            return award.Id;
        }
    }
}
