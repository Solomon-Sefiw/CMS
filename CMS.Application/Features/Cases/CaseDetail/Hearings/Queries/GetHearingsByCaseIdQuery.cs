using AutoMapper;
using CMS.Application.Features.Cases.CaseDetail.Hearings.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Hearings.Queries
{
    public record GetHearingsByCaseIdQuery(int CaseId ) : IRequest<List<HearingDto>>;

    public class GetHearingsByCaseIdQueryHandler : IRequestHandler<GetHearingsByCaseIdQuery, List<HearingDto>>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetHearingsByCaseIdQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<List<HearingDto>> Handle(GetHearingsByCaseIdQuery request, CancellationToken cancellationToken)
        {
            var hearings = await dataService.Hearings
                .Include(h => h.Case)
                .Include(h => h.Chilot)
                .Include(h => h.BusinessUnit)
                .Include(h => h.Participants)
                .Where(h => h.CaseId == request.CaseId)
                .ToListAsync(cancellationToken);

            return mapper.Map<List<HearingDto>>(hearings);
        }
    }
}
