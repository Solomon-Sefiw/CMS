using AutoMapper;
using CMS.Application.Features.BusinessUnits;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;

public record BusinessUnitSearchResult(List<BusinessUnitDto> Items, int TotalCount);
public record GetBusinessUnitsListQuery(ApprovalStatus Status, int PageNumber, int PageSize) : IRequest<BusinessUnitSearchResult>;

public class GetBusinessUnitsListQueryHandler : IRequestHandler<GetBusinessUnitsListQuery, BusinessUnitSearchResult>
{
    private readonly IDataService _dataService;

    public GetBusinessUnitsListQueryHandler(IDataService dataService)
    {
        _dataService = dataService;
    }

    public async Task<BusinessUnitSearchResult> Handle(GetBusinessUnitsListQuery request, CancellationToken cancellationToken)
    {
        // Filter BusinessUnits by Status and ApprovalStatus
        var query = _dataService.BusinessUnits
            .Where(b =>  b.ApprovalStatus == request.Status);

        // Get total count for pagination
        var totalCount = await query.CountAsync(cancellationToken);

        // Paginate the data
        var paginatedBusinessUnits = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        // Preload related data
        var businessUnitTypes = await _dataService.BusinessUnitTypes
            .ToDictionaryAsync(b => b.Value, cancellationToken);
        var addreses = await _dataService.Addresses
            .ToDictionaryAsync(b => b.RequestId, cancellationToken);

        var parentBusinessUnits = await _dataService.BusinessUnits
            .Where(b => paginatedBusinessUnits.Select(p => p.ParentId).Contains(b.Id))
            .ToDictionaryAsync(b => b.Id, cancellationToken);

        // Map results to DTOs
        var businessUnitDtos = paginatedBusinessUnits.Select(bu =>
        {
            var parent = parentBusinessUnits.GetValueOrDefault(bu.ParentId);
            var businessUnitType = businessUnitTypes.GetValueOrDefault(bu.Type);
            var address = addreses.GetValueOrDefault(bu.Id);



            return new BusinessUnitDto
            {
                Id = bu.Id,
                Name = bu.Name,
                BusinessUnitID = bu.BusinessUnitID,
                BusinessUnitCode = bu.BusinessUnitCode,
                ParentBusinessUnitName = parent?.Name,
                ParentId = bu.ParentId,
                BusinessUnitTypeName = businessUnitType?.Name,
                Type = bu.Type,
                StaffStrength = bu.StaffStrength,
                ApprovalStatus = bu.ApprovalStatus,
                Status = bu.Status,
                Address = addreses.ContainsKey(bu.Id) ? addreses[bu.Id] : null

            };
        }).ToList();

        return new BusinessUnitSearchResult(businessUnitDtos, totalCount);
    }
}
