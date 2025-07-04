
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using CMS.Services.DataService;
using CMS.Domain.Education;
using CMS.Application.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Educations.Setups.Award.Commands.UpdateAward
{
    public class UpdateAwardCommand : IRequest<int> // Returns the ID of the updated award
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
    public class UpdateAwardCommandHandler : IRequestHandler<UpdateAwardCommand, int>
    {
        private readonly IDataService _dataService;

        public UpdateAwardCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<int> Handle(UpdateAwardCommand request, CancellationToken cancellationToken)
        {
            var awardToUpdate = await _dataService.Awards.FindAsync(request.Id, cancellationToken);

            awardToUpdate.Name = request.Name;
            awardToUpdate.Description = request.Description;
            awardToUpdate.ApprovalStatus = Domain.Enum.ApprovalStatus.Draft;

            await _dataService.SaveAsync(cancellationToken);

            return awardToUpdate.Id;
        }
    }
}