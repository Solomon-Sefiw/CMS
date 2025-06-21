using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Exceptions;
using CMS.Application.Features.Commands.UpdateContact;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Contact.Commands.UpdateContact
{
    public class UpdateContactCommandHandler : IRequestHandler<UpdateContactCommand,int>
    {
        private readonly IDataService dataService;

        public UpdateContactCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(UpdateContactCommand command, CancellationToken cancellationToken)
        {
            var contact = await dataService.Contacts.FindAsync(command.Id);
            contact.Type = command.Type;
            contact.Value = command.Value;
            contact.contactCategory = command.ContactCategory;
            contact.RequestId = command.RequestId;

            await dataService.SaveAsync(cancellationToken);

            return contact.Id;
        }
    }

}
