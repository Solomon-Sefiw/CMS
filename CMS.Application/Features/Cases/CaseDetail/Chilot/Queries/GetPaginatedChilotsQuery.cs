using AutoMapper;
using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Application.Features.Cases.CaseDetail.Chilot.Models;
using CMS.Application.Features.Educations.Setups.Award.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Cases.CaseDetail.Chilot.Queries
{
    public record GetPaginatedChilotsQuery(
     ApprovalStatus? Status,
     int PageNumber = 1,
     int PageSize = 10
 ) : IRequest<PaginatedChilotList>;

    public record PaginatedChilotList(
        List<ChilotDto> Items,
        int TotalCount
    );

    public class GetPaginatedChilotsQueryHandler : IRequestHandler<GetPaginatedChilotsQuery, PaginatedChilotList>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetPaginatedChilotsQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<PaginatedChilotList> Handle(GetPaginatedChilotsQuery request, CancellationToken cancellationToken)
        {
            var query = _dataService.Chillots
                .AsQueryable();

            if (request.Status.HasValue)
            {
                query = query.Where(r => r.ApprovalStatus == request.Status.Value);
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var awardsPaginated = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var awardsDtos = _mapper.Map<List<ChilotDto>>(awardsPaginated);

            return new PaginatedChilotList(awardsDtos, totalCount);
        }
    }
}
