// Define a query to retrieve contacts by BusinessUnitId
using CMS.Application.Features.BusinessUnits;
using CMS.Application.Features.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;



public record GetContactsByRequestIdQuery(int RequestId,ContactCategoryEnum ContactCategory) : IRequest<Dictionary<string, List<ContactDto>>>;



public class GetContactsByRequestIdQueryHandler : IRequestHandler<GetContactsByRequestIdQuery, Dictionary<string, List<ContactDto>>>
{
    private readonly IDataService dataService;

    public GetContactsByRequestIdQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }

    public async Task<Dictionary<string, List<ContactDto>>> Handle(GetContactsByRequestIdQuery request, CancellationToken cancellationToken)
    {
        // Get the contacts for the provided BusinessUnitId
        var contacts = await dataService.Contacts
            .Where(c => c.RequestId == request.RequestId && c.contactCategory == request.ContactCategory)
            .ToListAsync(cancellationToken);

        // Group contacts by their type
        var contactTypes = contacts
            .GroupBy(c => c.Type.ToString())  // Group by ContactTypeEnum
            .ToDictionary(
                group => group.Key,
                group => group.Select(c => new ContactDto(
                    c.Id,
                    c.Type,
                    c.Value,
                    c.contactCategory,
                    c.RequestId 
                )).ToList()
            );

        return contactTypes;
    }
}
