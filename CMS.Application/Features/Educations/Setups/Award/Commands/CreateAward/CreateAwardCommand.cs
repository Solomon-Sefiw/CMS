using MediatR;
using CMS.Services.DataService;
namespace CMS.Application.Features.Educations.Setups.Award.Commands.CreateAward
{
    public class CreateAwardCommand : IRequest<int> // Returns the ID of the newly created award
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
    public class CreateAwardCommandHandler : IRequestHandler<CreateAwardCommand, int>
    {
        private readonly IDataService _dataService;

        public CreateAwardCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<int> Handle(CreateAwardCommand request, CancellationToken cancellationToken)
        {
            // Ensure the correct type is used for the Award entity
            var newAward = new CMS.Domain.Education.awards.Award()
            {
                Name = request.Name,
                Description = request.Description
            };

            // Ensure the correct type is used in the AddAsync method
            await _dataService.Awards.AddAsync(newAward, cancellationToken);
            await _dataService.SaveAsync(cancellationToken);

            return newAward.Id;
        }
    }
}