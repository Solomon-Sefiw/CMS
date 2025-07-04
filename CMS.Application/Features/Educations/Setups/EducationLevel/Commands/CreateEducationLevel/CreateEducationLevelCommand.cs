using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Education;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.EducationLevel.Commands.CreateEducationLevel
{

    public class CreateEducationLevelCommand : IRequest<int> // Returns the ID of the newly created award
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
    public class CreateEducationLevelCommandHandler : IRequestHandler<CreateEducationLevelCommand, int>
    {
        private readonly IDataService _dataService;

        public CreateEducationLevelCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<int> Handle(CreateEducationLevelCommand request, CancellationToken cancellationToken)
        {
            var newEducationLevel = new CMS.Domain.Education.EducationLevel()
            {
                Name = request.Name,
                Description = request.Description
            };


            await _dataService.EducationLevels.AddAsync(newEducationLevel, cancellationToken); 
            await _dataService.SaveAsync(cancellationToken);

            return newEducationLevel.Id;
        }
    }
}
