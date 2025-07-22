using AutoMapper;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Queries
{

    public record GetPaginatedActingsQuery(
     int Id,
  ApprovalStatus? Status,
  int PageNumber = 1,
  int PageSize = 10
) : IRequest<PaginatedActinglist>;

    public record PaginatedActinglist(
        List<ActingDto> Items,
        int TotalCount
    );

    public class GetPaginatedDelegationsQueryHandler : IRequestHandler<GetPaginatedActingsQuery, PaginatedActinglist>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetPaginatedDelegationsQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<PaginatedActinglist> Handle(GetPaginatedActingsQuery request, CancellationToken cancellationToken)
        {
            var query = _dataService.Actings
                .Include(d => d.Employee)
                .Include(d => d.JobRole)
                .Include(d => d.BusinessUnit)
                .AsQueryable();

            if (request.Status.HasValue)
            {
                query = query.Where(r => r.ApprovalStatus == request.Status.Value && r.EmployeeId == request.Id);
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var regionsPaginated = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var regionDtos = _mapper.Map<List<ActingDto>>(regionsPaginated);

            return new PaginatedActinglist(regionDtos, totalCount);
        }
    }

}
