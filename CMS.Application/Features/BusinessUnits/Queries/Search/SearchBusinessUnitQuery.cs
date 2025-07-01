
using System.Threading;
using CMS.Application.Features.BusinessUnits;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

public record SearchBusinessUnitQuery(string SearchTerm) : IRequest<List<BusinessUnitDto>>;

public class SearchBusinessUnitQueryHandler : IRequestHandler<SearchBusinessUnitQuery, List<BusinessUnitDto>>
{
    private readonly IDataService dataService;

    public SearchBusinessUnitQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }

    public async Task<List<BusinessUnitDto>> Handle(SearchBusinessUnitQuery request, CancellationToken cancellationToken)
    {
        var searchTerm = request.SearchTerm.ToLower();

        // Fetch filtered business units
        var businessUnits = await dataService.BusinessUnits
            .Where(bu =>
                bu.Name.ToLower().Contains(searchTerm) ||
                bu.BusinessUnitID.ToLower().Contains(searchTerm))
            .ToListAsync(cancellationToken);

        // Pre-fetch types and employees into dictionaries for fast lookup
        var businessUnitTypes = await dataService.BusinessUnitTypes
            .ToDictionaryAsync(but => but.Value, but => but.Name, cancellationToken);

        // Map business units to DTOs
        return businessUnits.Select(bu => new BusinessUnitDto
        {
            Id = bu.Id,
            Name = bu.Name,
            BusinessUnitID = bu.BusinessUnitID,
            BusinessUnitCode = bu.BusinessUnitCode,
            ParentBusinessUnitName = businessUnits.FirstOrDefault(p => p.Id == bu.ParentId)?.Name,
            ParentId = bu.ParentId,
            BusinessUnitTypeName = businessUnitTypes.GetValueOrDefault(bu.Type),
            Type = bu.Type,
            StaffStrength = bu.StaffStrength,
            Status = bu.Status
        }).ToList();
    }
}




