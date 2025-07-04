using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.FieldOfStudy.Commands.CreateFieldOfStudy
{
    public class CreateFieldOfStudyCommand : IRequest<int> // Returns the ID of the newly created award
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
    public class CreateFieldOfStudyCommandHandler : IRequestHandler<CreateFieldOfStudyCommand, int>
    {
        private readonly IDataService _dataService;

        public CreateFieldOfStudyCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<int> Handle(CreateFieldOfStudyCommand request, CancellationToken cancellationToken)
        {

            var newFieldOfStudy = new CMS.Domain.Education.FieldOfStudy() // Fully qualify the type to avoid ambiguity
            {
                Name = request.Name,
                Description = request.Description
            };

            await _dataService.FieldOfStudies.AddAsync(newFieldOfStudy, cancellationToken); // Assuming 'EducationLevels' is the correct DbSet
            await _dataService.SaveAsync(cancellationToken);

            return newFieldOfStudy.Id;
        }
    }
}
