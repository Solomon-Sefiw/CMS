using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Letter.Commands.CreateLetter
{
    namespace CMS.Application.Features.Letter.Commands
    {
        public record CreateEditableLetterCommand(
            string ReferenceNumber,
            string Subject,
            string Content,
            string DocumentJson,
            LetterType LetterType,
            string SenderId,
            string? RecipientId,
            int BusinessUnitId
        ) : IRequest<int>;

        public class CreateEditableLetterHandler : IRequestHandler<CreateEditableLetterCommand, int>
        {
            private readonly IDataService _dataService;
            private readonly IMapper _mapper;

            public CreateEditableLetterHandler(IDataService dataService, IMapper mapper)
            {
                _dataService = dataService;
                _mapper = mapper;
            }

            public async Task<int> Handle(CreateEditableLetterCommand request, CancellationToken cancellationToken)
            {
                var letter = new Domain.letters.Letter
                {
                    ReferenceNumber = request.ReferenceNumber,
                    Subject = request.Subject,
                    Content = request.Content,
                    DocumentJsonContent = request.DocumentJson,
                    LetterType = request.LetterType,
                    Status = LetterStatus.pending,
                    SenderId = request.SenderId,
                    RecipientId = request.RecipientId,
                    BusinessUnitId = request.BusinessUnitId,
                    ReceivedDate = DateTime.Now,
                    SentDate = DateTime.Now,
                    IsEditableDocument = true
                };

                _dataService.Letters.Add(letter);
                await _dataService.SaveAsync(cancellationToken);

                return letter.Id;
            }
        }
    }
}
