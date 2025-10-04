using AutoMapper;
using CMS.Domain.Timelines;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Timelines.Commands.CreateCaseTimeline
{
    public class CreateCaseTimelineCommand : IRequest<int>
    {
        public int CaseId { get; set; }
        public string EventType { get; set; } = string.Empty;
        public string? Details { get; set; }
        public string? ActorUserId { get; set; }
        public DateTime? EventAt { get; set; } // optional: if not provided, set now
    }

    public class CreateCaseTimelineCommandHandler : IRequestHandler<CreateCaseTimelineCommand, int>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;
        // private backing field consistent with constructor usage
        private readonly IDataService _data_service;
        public CreateCaseTimelineCommandHandler(IDataService dataService, IMapper mapper)
        {
            _data_service = dataService; // fix to match field name below
            _mapper = mapper;
        }

        public async Task<int> Handle(CreateCaseTimelineCommand request, CancellationToken cancellationToken)
        {
            var entity = _mapper.Map<CaseTimeline>(request);

            // Stamp event time if none provided
            entity.EventAt = request.EventAt ?? DateTime.UtcNow;

            await _data_service.CaseTimelines.AddAsync(entity, cancellationToken);
            await _data_service.SaveAsync(cancellationToken);

            return entity.Id;
        }


    }
}
