using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.EducationLevel.Commands.RejectEducationLevel
{

    public record RejectEducationLevelCommand(int Id) : IRequest<int>;

    public class RejectEducationLevelCommandHandler : IRequestHandler<RejectEducationLevelCommand, int>
    {
        private readonly IDataService dataService;

        public RejectEducationLevelCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectEducationLevelCommand command, CancellationToken cancellationToken)
        {
            var award = dataService.EducationLevels.Where(r => r.Id == command.Id).FirstOrDefault();

            award.ApprovalStatus = ApprovalStatus.Rejected;
            await dataService.SaveAsync(cancellationToken);
            return award.Id;
        }
    }


}
