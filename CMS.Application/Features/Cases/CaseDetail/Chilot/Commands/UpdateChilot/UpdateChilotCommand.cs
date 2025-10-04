using AutoMapper;
using CMS.Domain.Courts;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Chilot.Commands.UpdateChilot
{
    // Command to update Chilot
    public class UpdateChilotCommand : IRequest<int>
    {
        public int Id { get; set; } 
        public string Name { get; set; }
        public ChilotType ChilotType { get; set; }
        public string? RoomNumber { get; set; }
        public int BusinessUnitId { get; set; }
    }

    // Handler for UpdateChilotCommand
    public class UpdateChilotCommandHandler : IRequestHandler<UpdateChilotCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public UpdateChilotCommandHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<int> Handle(UpdateChilotCommand command, CancellationToken cancellationToken)
        {
            // Find existing chilot
            var existingChilot = await dataService.Chillots.FindAsync(command.Id);
            if (existingChilot == null)
            {
                throw new KeyNotFoundException($"Chilot with Id {command.Id} not found.");
            }

            // Update properties
            existingChilot.Name = command.Name;
            existingChilot.ChilotType = command.ChilotType;
            existingChilot.RoomNumber = command.RoomNumber;
            existingChilot.BusinessUnitId = command.BusinessUnitId;

            // Persist changes
            dataService.Chillots.Update(existingChilot);
            await dataService.SaveAsync(cancellationToken);

            return existingChilot.Id;
        }
    }
}
