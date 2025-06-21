
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Commands.CreateContact
{
    public class CreateContactCommandHandler : IRequestHandler<CreateContactCommand, int>
    {
        private readonly IDataService dataService;

        public CreateContactCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(CreateContactCommand command, CancellationToken cancellationToken)
        {
            var contact = new Domain.Contacts.Contact
            {
                Type = command.Type,
                Value = command.Value,
                contactCategory = command.ContactCategory,
                RequestId = command.RequestId
            };
            dataService.Contacts.Add(contact);
            await dataService.SaveAsync(cancellationToken);

            return contact.Id;
        }
    }

}
