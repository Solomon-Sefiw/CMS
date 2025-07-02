using CMS.Application.Features.Documents.Commands;
using CMS.Application.Security;
using CMS.Domain.Document;
using CMS.Domain.Enum;
using CMS.Domain.LetterDocument;
using CMS.Services.DataService;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Letter.Commands.Documents
{
    public record AddLetterDocumentCommand(int LetterId,DocumentType DocumentType, IFormFile File) : IRequest<Document>;

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

            if (request.DocumentType == DocumentType.LetterDocument)
            {
                var existingDocuments = await dataService.LetterDocuments.Where(d => d.LetterId == request.LetterId && d.DocumentType == DocumentType.LetterDocument).ToListAsync();
                dataService.LetterDocuments.RemoveRange(existingDocuments);
            }

            dataService.LetterDocuments.Add(new LetterDocument()
            {
                LetterId = request.LetterId,
                DocumentType = request.DocumentType,
                DocumentId = document.Id,
                IsImage = document.ContentType.StartsWith("image/"),
                FileName = document.FileName
            });

            await dataService.SaveAsync(cancellationToken);

            return document;
        }
    }
}

//public record AddTransferDocumentCommand(int TransferId, DocumentType DocumentType, IFormFile File) : IRequest<Document>;


//public class AddTransferDocumentCommandHandler : IRequestHandler<AddTransferDocumentCommand, Document>
//{
//    private readonly IDataService dataService;
//    private readonly IMediator mediator;

//    public AddTransferDocumentCommandHandler(IDataService dataService, IMediator mediator)
//    {
//        this.dataService = dataService;
//        this.mediator = mediator;
//    }

//    public async Task<Document> Handle(AddTransferDocumentCommand request, CancellationToken cancellationToken)
//    {
//        var document = await mediator.Send(new AddDocumentCommand()
//        {
//            File = request.File
//        });

//        if (request.DocumentType == DocumentType.LetterDocument)
//        {
//            var existingDocuments = await dataService.LetterDocuments.Where(d => d.LetterId == request.TransferId && d.DocumentType == DocumentType.LetterDocument).ToListAsync();
//            dataService.LetterDocuments.RemoveRange(existingDocuments);
//        }

//        dataService.LetterDocuments.Add(new LetterDocument()
//        {
//            LetterId = request.TransferId,
//            DocumentType = request.DocumentType,
//            DocumentId = document.Id,
//            IsImage = document.ContentType.StartsWith("image/"),
//            FileName = document.FileName
//        });

//        await dataService.SaveAsync(cancellationToken);

//        return document;
//    }
//}
