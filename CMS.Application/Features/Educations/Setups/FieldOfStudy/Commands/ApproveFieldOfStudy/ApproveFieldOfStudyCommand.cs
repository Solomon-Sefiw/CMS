using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.FieldOfStudy.Commands.ApproveFieldOfStudy
{
    public record ApproveFieldOfStudyCommand(int Id) : IRequest<int>;

    public class ApproveFieldOfStudyCommandHandler : IRequestHandler<ApproveFieldOfStudyCommand, int>
    {
        private readonly IDataService dataService;

        public ApproveFieldOfStudyCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ApproveFieldOfStudyCommand command, CancellationToken cancellationToken)
        {
            var fieldOfStudy = dataService.FieldOfStudies.Where(r => r.Id == command.Id).FirstOrDefault();
            fieldOfStudy.ApprovalStatus = ApprovalStatus.Approved;
            await dataService.SaveAsync(cancellationToken);
            return fieldOfStudy.Id;
        }
    }

}
