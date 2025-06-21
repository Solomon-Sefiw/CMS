using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Features.Models;
using CMS.Application.Features.Queries;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Queries
{
    public class GetContactByRequestIdQueryHandler : IRequestHandler<GetContactByRequestIdQuery, ContactDto>
    {
        private readonly IDataService dataService;

        public GetContactByRequestIdQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<ContactDto> Handle(GetContactByRequestIdQuery query, CancellationToken cancellationToken)
        {
            var contacts = await dataService.Contacts.
                Where(x => x.RequestId == query.RequestId &&
                x.contactCategory == query.contactCategory && x.Type == query.type)
                .ToListAsync(cancellationToken);

#pragma warning disable CS8603 // Possible null reference return.
            return contacts.Select(contact => new ContactDto(
                contact.Id,
                contact.Type,
                contact.Value,
                contact.contactCategory,
                contact.RequestId
            )).FirstOrDefault();
#pragma warning restore CS8603 // Possible null reference return.
        }
    }

}