// Define a query to retrieve contacts by BusinessUnitId
using CMS.Application.Features.BusinessUnits;
using CMS.Application.Features.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;



public record GetContactsByEntityTypeQuery( int? employeeId) : IRequest<List<ContactDto>>;



public class GetContactsByEntityTypeQueryHandler : IRequestHandler<GetContactsByEntityTypeQuery, List<ContactDto>>
{
    private readonly IDataService dataService;

    public GetContactsByEntityTypeQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }

    public async Task<List<ContactDto>> Handle(GetContactsByEntityTypeQuery request, CancellationToken cancellationToken)
    {
        // Fetch contacts for the provided employeeId, including related BusinessUnit (if applicable)
        var contacts = await dataService.Contacts
          .Where(c => c.RequestId == request.employeeId &&
                      (c.contactCategory == ContactCategoryEnum.EmployeeParentContact || c.contactCategory == ContactCategoryEnum.EmployeeSpouseContact))
          .ToListAsync(cancellationToken);

        var contactTypes = contacts.Select(c => new ContactDto(
            c.Id, 
            c.Type, 
            c.Value,
            c.contactCategory, 
            c.RequestId 
        )).ToList();


        return contactTypes;
    }

}
