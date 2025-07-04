using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.FieldOfStudy.Commands.SubmitFieldOfStudy
{
    public record SubmitFieldOfStudyCommand(int Id) : IRequest<int>;

    public class SubmitFieldOfStudyCommandHandler : IRequestHandler<SubmitFieldOfStudyCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitFieldOfStudyCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(SubmitFieldOfStudyCommand command, CancellationToken cancellationToken)
        {
            var fieldOfStudy = dataService.FieldOfStudies.Where(r => r.Id == command.Id).FirstOrDefault();
            fieldOfStudy.ApprovalStatus = ApprovalStatus.Submitted;
            await dataService.SaveAsync(cancellationToken);
            return fieldOfStudy.Id;
        }
    }
}
