

using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.BusinessUnits.Queries
{
    public record BusinessUnitLists(
        List<BusinessUnitDto> Approved,
        List<BusinessUnitDto> Submitted,
        List<BusinessUnitDto> Rejected,
        List<BusinessUnitDto> Draft
    );

    public record GetBusinessUnitsQuery : IRequest<BusinessUnitLists>;

    public class GetBusinessUnitQueryHandler : IRequestHandler<GetBusinessUnitsQuery, BusinessUnitLists>
    {
        private readonly IDataService dataService;

        public GetBusinessUnitQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<BusinessUnitLists> Handle(GetBusinessUnitsQuery query, CancellationToken cancellationToken)
        {
            // Fetch all required data
            var businessUnits = await dataService.BusinessUnits.ToListAsync(cancellationToken);
            var businessUnitTypes = await dataService.BusinessUnitTypes
                .ToDictionaryAsync(but => but.Value, but => but.Name, cancellationToken);
            var employees = await dataService.Employees
                .ToDictionaryAsync(emp => emp.Id, emp => emp.DisplayName, cancellationToken);

            // Map and categorize business units
            var categorizedUnits = businessUnits.Select(bu => new BusinessUnitDto
            {
                Id = bu.Id,
                Name = bu.Name,
                BusinessUnitID = bu.BusinessUnitID,
                ParentBusinessUnitName = businessUnits.FirstOrDefault(p => p.Id == bu.ParentId)?.Name,
                BusinessUnitCode = bu.BusinessUnitCode,
                ParentId = bu.ParentId,
                BusinessUnitTypeName = businessUnitTypes.GetValueOrDefault(bu.Type),
                Type = bu.Type,
                StaffStrength = bu.StaffStrength,
                ApprovalStatus = bu.ApprovalStatus,
                Status = bu.Status,
            })
            .GroupBy(bu => bu.ApprovalStatus)
            .ToDictionary(g => g.Key, g => g.ToList());

            // Construct and return categorized lists
            return new BusinessUnitLists(
                Approved: categorizedUnits.GetValueOrDefault(ApprovalStatus.Approved, new List<BusinessUnitDto>()),
                Submitted: categorizedUnits.GetValueOrDefault(ApprovalStatus.Submitted, new List<BusinessUnitDto>()),
                Rejected: categorizedUnits.GetValueOrDefault(ApprovalStatus.Rejected, new List<BusinessUnitDto>()),
                Draft: categorizedUnits.GetValueOrDefault(ApprovalStatus.Draft, new List<BusinessUnitDto>())
            );
        }
    }
}



