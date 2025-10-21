using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Education.awards;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Cases.CaseDetail.Chilot.Commands.SubmitChilot
{
    public record SubmitChilotCommand(int Id) : IRequest<int>;

    public class SubmitChilotCommandHandler : IRequestHandler<SubmitChilotCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitChilotCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(SubmitChilotCommand command, CancellationToken cancellationToken)
        {
            var award = dataService.Chillots.Where(r => r.Id == command.Id).FirstOrDefault();

            award.ApprovalStatus = ApprovalStatus.Submitted;
            await dataService.SaveAsync(cancellationToken);
            return award.Id;
        }
    }
}
