using AutoMapper;
using CMS.Domain.Courts;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Chilot.Commands.CreateChilot
{
    public class CreateChilotCommand : IRequest<int>
    {
        public string Name { get; set; } = string.Empty;
        public ChilotType ChilotType { get; set; } = ChilotType.Wonjel;
        public string? RoomNumber { get; set; }
        public int BusinessUnitId { get; set; }
        }
                        


    public class CreateChilotCommandHandler : IRequestHandler<CreateChilotCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public CreateChilotCommandHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<int> Handle(CreateChilotCommand command, CancellationToken cancellationToken)
        {
            var address = new CMS.Domain.Courts.Chilot
            {
                Name = command.Name,
                ChilotType = command.ChilotType,
                RoomNumber = command.RoomNumber,
                BusinessUnitId = command.BusinessUnitId
            };
            await dataService.Chillots.AddAsync(address);
            await dataService.SaveAsync(cancellationToken);
            return address.Id;
        }
    }
}
