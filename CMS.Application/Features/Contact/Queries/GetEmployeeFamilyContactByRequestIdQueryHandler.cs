using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Features.Models;
using CMS.Application.Features.Queries;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CMS.Application.Features.Queries
{
    public record GetEmployeeFamilyContactByRequestIdQuery(int contactId,ContactCategoryEnum category) : IRequest<ContactDto>;

    public class GetEmployeeFamilyContactByRequestIdQueryHandler : IRequestHandler<GetEmployeeFamilyContactByRequestIdQuery,ContactDto>
    {
        private readonly IDataService dataService;

        public GetEmployeeFamilyContactByRequestIdQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<ContactDto> Handle(GetEmployeeFamilyContactByRequestIdQuery query, CancellationToken cancellationToken)
        {
        
           /* var contacts = await dataService.Contacts
                .Where(x => x.Id == query.contactId &&
                            (x.contactCategory == ContactCategoryEnum.EmployeeParentContact || x.contactCategory == ContactCategoryEnum.EmployeeSpouseContact|| x.contactCategory == ContactCategoryEnum.EmployeeGuaranter || x.contactCategory == ContactCategoryEnum.GuaranterWorkingFirmContact))
                .ToListAsync(cancellationToken);**/
            var contacts = await dataService.Contacts
         .Where(x => x.Id == query.contactId && (x.contactCategory == query.category))
         .ToListAsync(cancellationToken);

#pragma warning disable CS8603 // Possible null reference return.category

            var contactTypes = contacts.Select(c => new ContactDto(
            c.Id,
            c.Type,
            c.Value,
            c.contactCategory,
            c.RequestId
        )).FirstOrDefault();


            return contactTypes;
#pragma warning restore CS8603 // Possible null reference return.
        }
    }

}
