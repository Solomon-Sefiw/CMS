using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.FieldOfStudy.Commands.UpdateFieldOfStudy
{
    public class UpdateFieldOfStudyCommand : IRequest<int> // Returns the ID of the updated award
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
    public class UpdateFieldOfStudyCommandHandler : IRequestHandler<UpdateFieldOfStudyCommand, int>
    {
        private readonly IDataService _dataService;

        public UpdateFieldOfStudyCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<int> Handle(UpdateFieldOfStudyCommand request, CancellationToken cancellationToken)
        {
            var fieldOfStudyToUpdate = await _dataService.FieldOfStudies.FindAsync(request.Id, cancellationToken);

            fieldOfStudyToUpdate.Name = request.Name;
            fieldOfStudyToUpdate.Description = request.Description;
            fieldOfStudyToUpdate.ApprovalStatus = Domain.Enum.ApprovalStatus.Draft;

            await _dataService.SaveAsync(cancellationToken);

            return fieldOfStudyToUpdate.Id;
        }
    }
}
