using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CMS.Application.Features.Educations.Setups.Award.Models;
using CMS.Application.Features.Educations.Setups.EducationLevel.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Educations.Setups.EducationLevel.Queries
{
    public record GetPaginatedEducationLevelsQuery(
  ApprovalStatus? Status,
  int PageNumber = 1,
  int PageSize = 10
) : IRequest<PaginatedEducationLevelList>;

    public record PaginatedEducationLevelList(
        List<EducationLevelDto> Items,
        int TotalCount
    );

    public class GetPaginatedEducationLevelsQueryHandler : IRequestHandler<GetPaginatedEducationLevelsQuery, PaginatedEducationLevelList>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetPaginatedEducationLevelsQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<PaginatedEducationLevelList> Handle(GetPaginatedEducationLevelsQuery request, CancellationToken cancellationToken)
        {
            var query = _dataService.EducationLevels
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

            var awardsDtos = _mapper.Map<List<EducationLevelDto>>(awardsPaginated);

            return new PaginatedEducationLevelList(awardsDtos, totalCount);
        }
    }
}
