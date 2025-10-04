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
    public record GetCaseTimelinesByCaseIdQuery(int CaseId) : IRequest<List<CaseTimelineDto>>;

    public class GetCaseTimelinesByCaseIdQueryHandler : IRequestHandler<GetCaseTimelinesByCaseIdQuery, List<CaseTimelineDto>>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetCaseTimelinesByCaseIdQueryHandler(IDataService dataService, IMapper mapper)
        {
            _data_service = dataService;
            _mapper = mapper;
        }

        public async Task<List<CaseTimelineDto>> Handle(GetCaseTimelinesByCaseIdQuery request, CancellationToken cancellationToken)
        {
            var list = await _data_service.CaseTimelines
                .Where(t => t.CaseId == request.CaseId)
                .Include(t => t.Case)
                .OrderByDescending(t => t.EventAt)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<CaseTimelineDto>>(list);
        }

        private readonly IDataService _data_service;
    }
}
