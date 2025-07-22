using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Application.Features.Addresses.Setups.Region.Queiries;
using CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Employees.EmployeeActivities.DelegationAssignment.Queries
{
    public record GetAllDelegationsQuery() : IRequest<DelegationLists>;
    public record DelegationLists(
    IEnumerable<DelegationDto> Approved,
    IEnumerable<DelegationDto> Submitted,
    IEnumerable<DelegationDto> Rejected,
    IEnumerable<DelegationDto> Draft
    );


    public class GetAllDelegationsQueryHandler : IRequestHandler<GetAllDelegationsQuery, DelegationLists>
    {
        private readonly IDataService dataService;

        public GetAllDelegationsQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<DelegationLists> Handle(GetAllDelegationsQuery query, CancellationToken cancellationToken)
        {
            var delegations = await dataService.Delegations
                .Include(d => d.Employee)
                .Include(d => d.JobRole)
                .Include(d => d.BusinessUnit)
                .ToListAsync(cancellationToken);

            var regionList = delegations.Select(delegation => new DelegationDto(
                delegation.Id,
                delegation.EmployeeId,
                delegation.Employee,
                delegation.JobRoleId,
                delegation.JobRole,
                delegation.BusinessUnitId,
                delegation.BusinessUnit,
                delegation.StartDate,
                delegation.EndDate,
                delegation.ApprovalStatus
            ));
            var approved = regionList.Where(r => r.ApprovalStatus == ApprovalStatus.Approved).ToList();
            var submitted = regionList.Where(r => r.ApprovalStatus == ApprovalStatus.Submitted).ToList();
            var rejected = regionList.Where(r => r.ApprovalStatus == ApprovalStatus.Rejected).ToList();
            var draft = regionList.Where(r => r.ApprovalStatus == ApprovalStatus.Draft).ToList();


            return new DelegationLists(
              Approved: approved,
              Rejected: rejected,
              Submitted: submitted,
              Draft: draft
              );


        }
    }
}
