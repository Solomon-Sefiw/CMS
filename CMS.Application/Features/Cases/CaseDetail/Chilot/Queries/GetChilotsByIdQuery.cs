using AutoMapper;
using CMS.Application.Features.Cases.CaseDetail.Chilot.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Chilot.Queries
{
    // Query
    public record GetChilotsByBusinessUnitIdQuery(int BusinessUnitId) : IRequest<List<ChilotDto>>;

    // Handler
    public class GetChilotsByBusinessUnitIdQueryHandler : IRequestHandler<GetChilotsByBusinessUnitIdQuery, List<ChilotDto>>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetChilotsByBusinessUnitIdQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<List<ChilotDto>> Handle(GetChilotsByBusinessUnitIdQuery request, CancellationToken cancellationToken)
        {
            var chilots = await dataService.Chillots
                .Where(x => x.BusinessUnitId == request.BusinessUnitId)
                .ToListAsync(cancellationToken);

            return mapper.Map<List<ChilotDto>>(chilots);
        }
    }
}
