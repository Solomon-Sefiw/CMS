using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.BusinessUnits.Queries
{
    public record SearchBusinessUnitsQuery : IRequest<List<BusinessUnitDto>>;

    public class SearchBusinessUnitsQueryHandler : IRequestHandler<SearchBusinessUnitsQuery, List<BusinessUnitDto>>
    {
        private readonly IDataService _dataService;

        public SearchBusinessUnitsQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<List<BusinessUnitDto>> Handle(SearchBusinessUnitsQuery request, CancellationToken cancellationToken)
        {
            // Fetch all required data
            var businessUnits = await _dataService.BusinessUnits.ToListAsync(cancellationToken);
            var businessUnitTypes = await _dataService.BusinessUnitTypes
                .ToDictionaryAsync(but => but.Value, but => but.Name, cancellationToken);
            var employees = await _dataService.Employees
                .ToDictionaryAsync(emp => emp.Id, emp => emp.DisplayName, cancellationToken);

            // Map business units to DTOs
            return businessUnits.Select(bu => new BusinessUnitDto
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
            }).ToList();
        }
    }
}



