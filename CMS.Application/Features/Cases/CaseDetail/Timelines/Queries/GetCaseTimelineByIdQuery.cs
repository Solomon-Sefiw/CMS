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
    public record GetCaseTimelineByIdQuery(int Id) : IRequest<CaseTimelineDto?>;

    public class GetCaseTimelineByIdQueryHandler : IRequestHandler<GetCaseTimelineByIdQuery, CaseTimelineDto?>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetCaseTimelineByIdQueryHandler(IDataService dataService, IMapper mapper)
        {
            _data_service = dataService;
            _mapper = mapper;
        }

        public async Task<CaseTimelineDto?> Handle(GetCaseTimelineByIdQuery request, CancellationToken cancellationToken)
        {
            var entity = await _data_service.CaseTimelines
                .Include(t => t.Case)
                .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);

            if (entity == null) return null;

            return _mapper.Map<CaseTimelineDto>(entity);
        }

        private readonly IDataService _data_service;
    }
}
