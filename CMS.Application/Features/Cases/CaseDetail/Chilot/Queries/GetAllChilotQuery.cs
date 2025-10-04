using AutoMapper;
using CMS.Application.Features.Cases.CaseDetail.Chilot.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace CMS.Application.Features.Cases.CaseDetail.Chilot.Queries
{
    // Query
    public record GetAllChilotQuery() : IRequest<List<ChilotDto>>;

    // Handler
    public class GetAllChilotQueryHandler : IRequestHandler<GetAllChilotQuery, List<ChilotDto>>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetAllChilotQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<List<ChilotDto>> Handle(GetAllChilotQuery request, CancellationToken cancellationToken)
        {
            var chilots = await dataService.Chillots
                .ToListAsync(cancellationToken);

            return mapper.Map<List<ChilotDto>>(chilots);
        }
    }
}
