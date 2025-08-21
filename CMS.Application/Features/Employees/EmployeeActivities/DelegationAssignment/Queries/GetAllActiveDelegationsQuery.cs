using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Queries
{
    public record GetAllActiveDelegationsQuery(int Id) : IRequest<DelegationDto>;


    public class GetAllActiveDelegationsQueryHandler : IRequestHandler<GetAllActiveDelegationsQuery, DelegationDto>
    {
        private readonly IDataService dataService;

        public GetAllActiveDelegationsQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<DelegationDto> Handle(GetAllActiveDelegationsQuery query, CancellationToken cancellationToken)
        {
            return  dataService.Delegations
                .Where(d => d.IsActive == true && d.EmployeeId == query.Id)
                .Select(delegation => new DelegationDto(
                    delegation.Id,
                    delegation.EmployeeId,
                    delegation.Employee,
                    delegation.JobRoleId,
                    delegation.JobRole,
                    delegation.BusinessUnitId,
                    delegation.BusinessUnit,
                    delegation.StartDate,
                    delegation.EndDate,
                    delegation.ApprovalStatus,
                    delegation.IsActive
                )).FirstOrDefault();
        }
    }
}
