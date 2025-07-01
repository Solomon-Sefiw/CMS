using CMS.Application.Features.Documents.Commands;
using CMS.Domain.Document;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Letter.Commands.Documents
{
    public record AddLetterDocumentCommand(int LetterId, IFormFile File) : IRequest<Document>;

    public class AddLetterDocumentCommandHandler : IRequestHandler<AddLetterDocumentCommand, Document>
    {
        private readonly IDataService dataService;
        private readonly IMediator mediator;

        public AddLetterDocumentCommandHandler(IDataService dataService, IMediator mediator)
        {
            this.dataService = dataService;
            this.mediator = mediator;
        }

        public async Task<Document> Handle(AddLetterDocumentCommand request, CancellationToken cancellationToken)
        {
            var document = await mediator.Send(new AddDocumentCommand()
            {
                File = request.File
            });

            var currentPhoto = await dataService.LetterDocuments
                .Where(sd => sd.LetterId == request.LetterId &&
                sd.DocumentType == DocumentType.LetterDocument).ToListAsync();

            dataService.LetterDocuments.AttachRange(currentPhoto);

            dataService.LetterDocuments.RemoveRange(currentPhoto);
            await dataService.SaveAsync(cancellationToken);

            dataService.LetterDocuments.Add(new Domain.LetterDocument.LetterDocument()
            {
                LetterId = request.LetterId,
                DocumentType = DocumentType.LetterDocument,
                DocumentId = document.Id,
                FileName = document.FileName
            });

            await dataService.SaveAsync(cancellationToken);
            var latestPhoto = await (from ed in dataService.LetterDocuments
                                     join d in dataService.Documents on ed.DocumentId equals d.Id
                                     where ed.LetterId == request.LetterId &&
                                           ed.DocumentType == DocumentType.LetterDocument &&
                                           (ed.IsDeleted == null || ed.IsDeleted == false)
                                     select d)
                          .FirstOrDefaultAsync(cancellationToken);

            return latestPhoto!;
        }
    }
}