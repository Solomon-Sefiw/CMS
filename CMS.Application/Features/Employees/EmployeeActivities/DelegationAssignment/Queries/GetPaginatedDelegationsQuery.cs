using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Queries
{
    public record GetPaginatedDelegationsQuery(
        int Id,
     ApprovalStatus? Status,
     int PageNumber = 1,
     int PageSize = 10
 ) : IRequest<PaginatedDelegationlist>;

    public record PaginatedDelegationlist(
        List<DelegationDto> Items,
        int TotalCount
    );

    public class GetPaginatedDelegationsQueryHandler : IRequestHandler<GetPaginatedDelegationsQuery, PaginatedDelegationlist>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetPaginatedDelegationsQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<PaginatedDelegationlist> Handle(GetPaginatedDelegationsQuery request, CancellationToken cancellationToken)
        {
            var query =  _dataService.Delegations
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

            var regionDtos = _mapper.Map<List<DelegationDto>>(regionsPaginated);

            return new PaginatedDelegationlist(regionDtos, totalCount);
        }
    }
}
