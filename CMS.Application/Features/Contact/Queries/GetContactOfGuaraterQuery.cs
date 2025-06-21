// Define a query to retrieve contacts by BusinessUnitId
using CMS.Application.Features.BusinessUnits;
using CMS.Application.Features.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;



public record GetContactOfGuaraterQuery( int? employeeId) : IRequest<List<ContactDto>>;



public class GetContactOfGuaraterQueryHandler : IRequestHandler<GetContactOfGuaraterQuery, List<ContactDto>>
{
    private readonly IDataService dataService;

    public GetContactOfGuaraterQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }

    public async Task<List<ContactDto>> Handle(GetContactOfGuaraterQuery request, CancellationToken cancellationToken)
    {
        var contacts = await dataService.Contacts
          .Where(c => c.RequestId == request.employeeId &&
                      (c.contactCategory ==ContactCategoryEnum.EmployeeGuaranter))
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
