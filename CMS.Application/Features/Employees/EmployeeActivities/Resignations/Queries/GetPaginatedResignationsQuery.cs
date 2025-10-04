using AutoMapper;
using CMS.Application.Features.Employees.EmployeeActivities.Resignations.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.Resignations.Queries
{
    public record GetPaginatedResignationsQuery(
          int EmployeeId,
          ApprovalStatus? Status,
          int PageNumber = 1,
          int PageSize = 10
      ) : IRequest<PaginatedResignationList>;

    public record PaginatedResignationList(List<ResignationDto> Items, int TotalCount);

    public class GetPaginatedResignationsQueryHandler : IRequestHandler<GetPaginatedResignationsQuery, PaginatedResignationList>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetPaginatedResignationsQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<PaginatedResignationList> Handle(GetPaginatedResignationsQuery request, CancellationToken cancellationToken)
        {
            var query = dataService.Resignations
                .Include(r => r.Employee)
                .Include(r => r.EmployeeFileDocuments)
                .AsQueryable();

            if (request.Status.HasValue)
            {
                query = query.Where(r => r.ApprovalStatus == request.Status.Value && r.EmployeeId == request.EmployeeId);
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var paginatedResignations = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var dtoList = mapper.Map<List<ResignationDto>>(paginatedResignations);

            return new PaginatedResignationList(dtoList, totalCount);
        }
    }
}
