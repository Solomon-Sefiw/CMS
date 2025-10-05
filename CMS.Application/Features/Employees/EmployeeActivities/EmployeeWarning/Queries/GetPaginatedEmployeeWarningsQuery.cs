
using AutoMapper;
using CMS.Application.Features.Employees.EmployeeActivities.EmployeeWarning.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Queries
{
    public record GetPaginatedEmployeeWarningsQuery(
        int Id,
     ApprovalStatus? Status,
     int PageNumber = 1,
     int PageSize = 10
 ) : IRequest<PaginatedEmployeeWarninglist>;

    public record PaginatedEmployeeWarninglist(
        List<EmployeeWarningDto> Items,
        int TotalCount
    );

    public class GetPaginatedEmployeeWarningsQueryHandler : IRequestHandler<GetPaginatedEmployeeWarningsQuery, PaginatedEmployeeWarninglist>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetPaginatedEmployeeWarningsQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<PaginatedEmployeeWarninglist> Handle(GetPaginatedEmployeeWarningsQuery request, CancellationToken cancellationToken)
        {
            var query = _dataService.EmployeeWarnings
                .Include(d => d.Employee)
                .AsQueryable();

            if (request.Status.HasValue)
            {
                query = query.Where(r => r.ApprovalStatus == request.Status.Value && r.EmployeeId == request.Id);
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var employeeWarningsPaginated = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var regionDtos = _mapper.Map<List<EmployeeWarningDto>>(employeeWarningsPaginated);
            return new PaginatedEmployeeWarninglist(regionDtos, totalCount);
        }
    }
}
