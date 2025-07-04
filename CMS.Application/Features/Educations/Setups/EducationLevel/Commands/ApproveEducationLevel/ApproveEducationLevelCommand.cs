using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.EducationLevel.Commands.ApproveEducationLevel
{
    public record ApproveEducationLevelCommand(int Id) : IRequest<int>;

    public class ApproveEducationLevelCommandHandler : IRequestHandler<ApproveEducationLevelCommand, int>
    {
        private readonly IDataService dataService;

        public ApproveEducationLevelCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ApproveEducationLevelCommand command, CancellationToken cancellationToken)
        {
            var award = dataService.EducationLevels.Where(r => r.Id == command.Id).FirstOrDefault();

            award.ApprovalStatus = ApprovalStatus.Approved;
            await dataService.SaveAsync(cancellationToken);
            return award.Id;
        }
    }

}
