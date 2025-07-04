using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Educations.Setups.InstitutionName.Commands.UpdateInstitutionName
{

    public class UpdateInstitutionNameCommand : IRequest<int> // Returns the ID of the updated award
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
    public class UpdateInstitutionNameCommandHandler : IRequestHandler<UpdateInstitutionNameCommand, int>
    {
        private readonly IDataService _dataService;

        public UpdateInstitutionNameCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<int> Handle(UpdateInstitutionNameCommand request, CancellationToken cancellationToken)
        {
            var institutionNameToUpdate = await _dataService.InstitutionNames.FindAsync(request.Id, cancellationToken);

            institutionNameToUpdate.Name = request.Name;
            institutionNameToUpdate.Description = request.Description;
            institutionNameToUpdate.ApprovalStatus = Domain.Enum.ApprovalStatus.Draft;

            await _dataService.SaveAsync(cancellationToken);

            return institutionNameToUpdate.Id;
        }
    }
}
