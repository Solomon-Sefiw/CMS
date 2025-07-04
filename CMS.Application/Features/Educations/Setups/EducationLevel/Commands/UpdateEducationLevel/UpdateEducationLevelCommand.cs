using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.EducationLevel.Commands.UpdateEducationLevel
{
    public class UpdateEducationLevelCommand : IRequest<int> 
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
    public class UpdateEducationLevelCommandHandler : IRequestHandler<UpdateEducationLevelCommand, int>
    {
        private readonly IDataService _dataService;

        public UpdateEducationLevelCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<int> Handle(UpdateEducationLevelCommand request, CancellationToken cancellationToken)
        {
            var educationLevelToUpdate = await _dataService.EducationLevels.FindAsync(request.Id, cancellationToken);

            educationLevelToUpdate.Name = request.Name;
            educationLevelToUpdate.Description = request.Description;
            educationLevelToUpdate.ApprovalStatus = Domain.Enum.ApprovalStatus.Draft;

            await _dataService.SaveAsync(cancellationToken);

            return educationLevelToUpdate.Id;
        }
    }
}
