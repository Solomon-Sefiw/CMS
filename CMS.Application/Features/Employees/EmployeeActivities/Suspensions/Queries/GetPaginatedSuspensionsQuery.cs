using AutoMapper;
using CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Queries
{
    public record GetPaginatedSuspensionsQuery(
        int EmployeeId,
        ApprovalStatus? Status,
        int PageNumber = 1,
        int PageSize = 10
    ) : IRequest<PaginatedSuspensionList>;

    public record PaginatedSuspensionList(List<SuspensionDto> Items, int TotalCount);

    public class GetPaginatedSuspensionsQueryHandler : IRequestHandler<GetPaginatedSuspensionsQuery, PaginatedSuspensionList>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetPaginatedSuspensionsQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<PaginatedSuspensionList> Handle(GetPaginatedSuspensionsQuery request, CancellationToken cancellationToken)
        {
            var query = dataService.Suspensions
                .Include(s => s.Employee)
                .Include(s => s.EmployeeFileDocuments)
                .AsQueryable();

            if (request.Status.HasValue)
            {
                query = query.Where(r => r.ApprovalStatus == request.Status.Value && r.EmployeeId == request.EmployeeId);
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var paginatedSuspensions = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var dtoList = mapper.Map<List<SuspensionDto>>(paginatedSuspensions);

            return new PaginatedSuspensionList(dtoList, totalCount);
        }
    }
}
