using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CMS.Application.Features.Educations.Setups.Award.Models;
using CMS.Application.Features.Educations.Setups.FieldOfStudy.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Educations.Setups.FieldOfStudy.Queries
{

    public record GetPaginatedFieldOfStudiesQuery(
  ApprovalStatus? Status,
  int PageNumber = 1,
  int PageSize = 10
) : IRequest<PaginatedFieldOfStudyList>;

    public record PaginatedFieldOfStudyList(
        List<FieldOfStudyDto> Items,
        int TotalCount
    );

    public class GetPaginatedFieldOfStudiesQueryHandler : IRequestHandler<GetPaginatedFieldOfStudiesQuery, PaginatedFieldOfStudyList>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetPaginatedFieldOfStudiesQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<PaginatedFieldOfStudyList> Handle(GetPaginatedFieldOfStudiesQuery request, CancellationToken cancellationToken)
        {
            var query = _dataService.FieldOfStudies
                .AsQueryable();

            if (request.Status.HasValue)
            {
                query = query.Where(r => r.ApprovalStatus == request.Status.Value);
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var fieldOfStudyPaginated = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var awardsDtos = _mapper.Map<List<FieldOfStudyDto>>(fieldOfStudyPaginated);

            return new PaginatedFieldOfStudyList(awardsDtos, totalCount);
        }
    }
}
