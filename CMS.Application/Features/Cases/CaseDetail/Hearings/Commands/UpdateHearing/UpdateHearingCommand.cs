using AutoMapper;
using CMS.Application.Features.Cases.CaseDetail.Hearings.Models;
using CMS.Domain.Enum;
using CMS.Domain.Hearings;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Cases.CaseDetail.Hearings.Commands.UpdateHearing
{
    public class UpdateHearingCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public DateTime ScheduledAt { get; set; }
        public HearingType HearingType { get; set; }
        public string? LocationOrUrl { get; set; }
        public string? ResponsibleJudgeId { get; set; }
        public int? ChilotId { get; set; }
        public int? BusinessUnitId { get; set; }
        public string? Notes { get; set; }
        public List<HearingParticipantDto> Participants { get; set; } = new();
    }

    public class UpdateHearingCommandHandler : IRequestHandler<UpdateHearingCommand, bool>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public UpdateHearingCommandHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<bool> Handle(UpdateHearingCommand request, CancellationToken cancellationToken)
        {
            var entity = await dataService.Hearings
                .Include(h => h.Participants)
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (entity == null) return false;

            // map simple fields
            mapper.Map(request, entity);

            // update participants
            entity.Participants.Clear();
            foreach (var p in request.Participants)
            {
                entity.Participants.Add(new HearingParticipant
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    DisplayName = p.DisplayName,
                    Role = p.Role
                });
            }

            await dataService.SaveAsync(cancellationToken);
            return true;
        }
    }
}
