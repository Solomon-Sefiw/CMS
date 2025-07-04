using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.InstitutionName.Commands.CreateInstitutionName
{

    public class CreateInstitutionNameCommand : IRequest<int> // Returns the ID of the newly created award
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
    public class CreateInstitutionNameCommandHandler : IRequestHandler<CreateInstitutionNameCommand, int>
    {
        private readonly IDataService _dataService;

        public CreateInstitutionNameCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<int> Handle(CreateInstitutionNameCommand request, CancellationToken cancellationToken)
        {
            var newInstitutionName = new CMS.Domain.Education.InstitutionName() // Fully qualify the type to avoid ambiguity
            {
                Name = request.Name,
                Description = request.Description
            };
            await _dataService.InstitutionNames.AddAsync(newInstitutionName, cancellationToken); // Assuming 'EducationLevels' is the correct DbSet
            await _dataService.SaveAsync(cancellationToken);

            return newInstitutionName.Id;
        }
    }
}
