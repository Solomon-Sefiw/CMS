using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CMS.Application.Features.Educations.Setups.Award.Models;
using CMS.Application.Features.Educations.Setups.InstitutionName.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Educations.Setups.InstitutionName.Queries
{

    public record GetPaginatedInstitutionNamesQuery(
    ApprovalStatus? Status,
    int PageNumber = 1,
    int PageSize = 10
) : IRequest<PaginatedInstitutionNameList>;

    public record PaginatedInstitutionNameList(
        List<InstitutionNameDto> Items,
        int TotalCount
    );

    public class GetPaginatedAwardsQueryHandler : IRequestHandler<GetPaginatedInstitutionNamesQuery, PaginatedInstitutionNameList>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetPaginatedAwardsQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<PaginatedInstitutionNameList> Handle(GetPaginatedInstitutionNamesQuery request, CancellationToken cancellationToken)
        {
            var query = _dataService.InstitutionNames
                .AsQueryable();

            if (request.Status.HasValue)
            {
                query = query.Where(r => r.ApprovalStatus == request.Status.Value);
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var institutionNamesPaginated = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var awardsDtos = _mapper.Map<List<InstitutionNameDto>>(institutionNamesPaginated);

            return new PaginatedInstitutionNameList(awardsDtos, totalCount);
        }
    }
}
