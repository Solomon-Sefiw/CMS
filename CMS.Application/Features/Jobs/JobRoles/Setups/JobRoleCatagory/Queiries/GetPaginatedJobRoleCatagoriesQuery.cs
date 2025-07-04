using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Jobs.JobRoles.Setups.JobRoleCatagory.Queiries
{

    public record GetPaginatedJobRoleCatagoriesQuery(
      ApprovalStatus? Status,
      int PageNumber = 1,
      int PageSize = 10
  ) : IRequest<PaginatedJobRoleCatagoryList>;

    public record PaginatedJobRoleCatagoryList(
        List<JobRoleCatagoryDto> Items,
        int TotalCount
    );

    public class GetPaginatedRegionsQueryHandler : IRequestHandler<GetPaginatedJobRoleCatagoriesQuery, PaginatedJobRoleCatagoryList>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetPaginatedRegionsQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<PaginatedJobRoleCatagoryList> Handle(GetPaginatedJobRoleCatagoriesQuery request, CancellationToken cancellationToken)
        {
            var query = _dataService.JobRoleCatagories
                .Include(r => r.JobRoles)
                .AsQueryable();

            if (request.Status.HasValue)
            {
                query = query.Where(r => r.ApprovalStatus == request.Status.Value);
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var jobRoleCategoriesPaginated = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var jobRoleCategories = _mapper.Map<List<JobRoleCatagoryDto>>(jobRoleCategoriesPaginated);

            return new PaginatedJobRoleCatagoryList(jobRoleCategories, totalCount);
        }
    }
}
