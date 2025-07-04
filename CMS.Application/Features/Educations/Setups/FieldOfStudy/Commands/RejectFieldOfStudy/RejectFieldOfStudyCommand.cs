using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.FieldOfStudy.Commands.RejectFieldOfStudy
{
    public record RejectFieldOfStudyCommand(int Id) : IRequest<int>;

    public class RejectFieldOfStudyCommandHandler : IRequestHandler<RejectFieldOfStudyCommand, int>
    {
        private readonly IDataService dataService;

        public RejectFieldOfStudyCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectFieldOfStudyCommand command, CancellationToken cancellationToken)
        {
            var fieldOfStudy = dataService.FieldOfStudies.Where(r => r.Id == command.Id).FirstOrDefault();
            fieldOfStudy.ApprovalStatus = ApprovalStatus.Rejected;
            await dataService.SaveAsync(cancellationToken);
            return fieldOfStudy.Id;
        }
    }
}
