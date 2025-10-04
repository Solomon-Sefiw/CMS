using AutoMapper;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Timelines.Commands.UpdateCaseTimeline
{
    public class UpdateCaseTimelineCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public int CaseId { get; set; }
        public string EventType { get; set; } = string.Empty;
        public string? Details { get; set; }
        public string? ActorUserId { get; set; }
        public DateTime EventAt { get; set; }
    }

    public class UpdateCaseTimelineCommandHandler : IRequestHandler<UpdateCaseTimelineCommand, bool>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;
        // keep naming consistent
        private readonly IDataService _data_service;
        public UpdateCaseTimelineCommandHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;

        }

        public async Task<bool> Handle(UpdateCaseTimelineCommand request, CancellationToken cancellationToken)
        {
            var entity = await _data_service.CaseTimelines
                .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);

            if (entity == null) return false;

            _mapper.Map(request, entity);

            _data_service.CaseTimelines.Update(entity);
            await _data_service.SaveAsync(cancellationToken);

            return true;
        }


    }
}
