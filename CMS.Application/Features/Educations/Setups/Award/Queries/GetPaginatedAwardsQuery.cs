using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Application.Features.Educations.Setups.Award.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Educations.Setups.Award.Queries
{
    public record GetPaginatedAwardsQuery(
     ApprovalStatus? Status,
     int PageNumber = 1,
     int PageSize = 10
 ) : IRequest<PaginatedAwardList>;

    public record PaginatedAwardList(
        List<AwardDto> Items,
        int TotalCount
    );

    public class GetPaginatedAwardsQueryHandler : IRequestHandler<GetPaginatedAwardsQuery, PaginatedAwardList>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetPaginatedAwardsQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<PaginatedAwardList> Handle(GetPaginatedAwardsQuery request, CancellationToken cancellationToken)
        {
            var query = _dataService.Awards
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

            var awardsDtos = _mapper.Map<List<AwardDto>>(awardsPaginated);

            return new PaginatedAwardList(awardsDtos, totalCount);
        }
    }
}
