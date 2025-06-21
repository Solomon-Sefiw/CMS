using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Addresses.Setups.Region.Queiries
{
    public record GetPaginatedRegionsQuery(
        ApprovalStatus? Status,
        int PageNumber = 1,
        int PageSize = 10
    ) : IRequest<PaginatedRegionList>;

    public record PaginatedRegionList(
        List<RegionDto> Items,
        int TotalCount
    );

    public class GetPaginatedRegionsQueryHandler : IRequestHandler<GetPaginatedRegionsQuery, PaginatedRegionList>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetPaginatedRegionsQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<PaginatedRegionList> Handle(GetPaginatedRegionsQuery request, CancellationToken cancellationToken)
        {
            var query = _dataService.Regions
                .Include(r => r.SubCities)
                .AsQueryable();

            if (request.Status.HasValue)
            {
                query = query.Where(r => r.ApprovalStatus == request.Status.Value);
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var regionsPaginated = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var regionDtos = _mapper.Map<List<RegionDto>>(regionsPaginated);

            return new PaginatedRegionList(regionDtos, totalCount);
        }
    }

}
