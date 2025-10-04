using AutoMapper;
using CMS.Application.Features.Cases.CaseDetail.Timelines.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Timelines.Queries
{
    public record GetAllCaseTimelinesQuery : IRequest<List<CaseTimelineDto>>;

    public class GetAllCaseTimelinesQueryHandler : IRequestHandler<GetAllCaseTimelinesQuery, List<CaseTimelineDto>>
    {
        private readonly IDataService _data_service;
        private readonly IMapper _mapper;

        public GetAllCaseTimelinesQueryHandler(IDataService dataService, IMapper mapper)
        {
            _data_service = dataService;
            _mapper = mapper;
        }

        public async Task<List<CaseTimelineDto>> Handle(GetAllCaseTimelinesQuery request, CancellationToken cancellationToken)
        {
            var list = await _data_service.CaseTimelines
                .Include(t => t.Case)
                .OrderByDescending(t => t.EventAt)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<CaseTimelineDto>>(list);
        }
    }
}
