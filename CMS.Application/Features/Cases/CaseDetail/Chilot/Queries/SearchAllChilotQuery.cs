using AutoMapper;
using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Application.Features.Cases.CaseDetail.Chilot.Models;
using CMS.Application.Features.Educations.Setups.Award.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace CMS.Application.Features.Cases.CaseDetail.Chilot.Queries
{

    public record SearchAllChilotQuery : IRequest<List<ChilotDto>>;
    internal class SearchAllChilotQueryHandler : IRequestHandler<SearchAllChilotQuery, List<ChilotDto>>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public SearchAllChilotQueryHandler(IDataService dataService,IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<List<ChilotDto>> Handle(SearchAllChilotQuery request, CancellationToken cancellationToken)
        {
            var chilots = await dataService.Chillots
                .ToListAsync(cancellationToken);

            return mapper.Map<List<ChilotDto>>(chilots);
        }
    }
}
