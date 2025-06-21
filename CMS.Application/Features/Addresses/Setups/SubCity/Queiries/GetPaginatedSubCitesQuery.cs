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

namespace CMS.Application.Features.Addresses.Setups.SubCity.Queiries
{

    public record GetPaginatedSubCitesQuery(
      ApprovalStatus? Status,
      int PageNumber = 1,
      int PageSize = 10
  ) : IRequest<PaginatedSubCityList>;

    public record PaginatedSubCityList(
        List<SubCityDto> Items,
        int TotalCount
    );

    public class GetPaginatedSubCitesQueryHandler : IRequestHandler<GetPaginatedSubCitesQuery, PaginatedSubCityList>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetPaginatedSubCitesQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<PaginatedSubCityList> Handle(GetPaginatedSubCitesQuery request, CancellationToken cancellationToken)
        {
            var query = _dataService.SubCities
                .Include(r => r.Region)
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

            var regionDtos = _mapper.Map<List<SubCityDto>>(regionsPaginated);

            return new PaginatedSubCityList(regionDtos, totalCount);
        }
    }

}
