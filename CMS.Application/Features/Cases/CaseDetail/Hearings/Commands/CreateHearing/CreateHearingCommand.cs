using AutoMapper;
using CMS.Application.Features.Cases.CaseDetail.Hearings.Models;
using CMS.Domain.Enum;
using CMS.Domain.Hearings;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Cases.CaseDetail.Hearings.Commands.CreateHearing
{
    public class CreateHearingCommand : IRequest<int>
    {
        public int CaseId { get; set; }
        public DateTime ScheduledAt { get; set; }
        public HearingType HearingType { get; set; }
        public string? LocationOrUrl { get; set; }
        public string? ResponsibleJudgeId { get; set; }
        public int? ChilotId { get; set; }
        public int? BusinessUnitId { get; set; }
        public string? Notes { get; set; }
        public List<HearingParticipantDto> Participants { get; set; } = new();
    }

    public class CreateHearingCommandHandler : IRequestHandler<CreateHearingCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public CreateHearingCommandHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<int> Handle(CreateHearingCommand request, CancellationToken cancellationToken)
        {
            var entity = mapper.Map<Hearing>(request);
            await dataService.Hearings.AddAsync(entity, cancellationToken);
            await dataService.SaveAsync(cancellationToken);
            return entity.Id;
        }
    }
}
