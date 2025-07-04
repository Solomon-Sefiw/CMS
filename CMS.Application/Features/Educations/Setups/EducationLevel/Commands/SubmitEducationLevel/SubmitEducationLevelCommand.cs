using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.EducationLevel.Commands.SubmitEducationLevel
{
    public record SubmitEducationLevelCommand(int Id) : IRequest<int>;

    public class SubmitEducationLevelCommandHandler : IRequestHandler<SubmitEducationLevelCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitEducationLevelCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(SubmitEducationLevelCommand command, CancellationToken cancellationToken)
        {
            var award = dataService.EducationLevels.Where(r => r.Id == command.Id).FirstOrDefault();

            award.ApprovalStatus = ApprovalStatus.Submitted;
            await dataService.SaveAsync(cancellationToken);
            return award.Id;
        }
    }
}
