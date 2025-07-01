using CMS.Application.Features.Documents.Commands;
using CMS.Domain.Document;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application.Features.UserAccount.Commands.Documents
{
    public record AddUserPhotoCommand(string userId, IFormFile File) : IRequest<Document>;

    public class AddUserPhotoCommandHandler : IRequestHandler<AddUserPhotoCommand, Document>
    {
        private readonly IDataService dataService;
        private readonly IMediator mediator;

        public AddUserPhotoCommandHandler(IDataService dataService, IMediator mediator)
        {
            this.dataService = dataService;
            this.mediator = mediator;
        }

        public async Task<Document> Handle(AddUserPhotoCommand request, CancellationToken cancellationToken)
        {
            var document = await mediator.Send(new AddDocumentCommand()
            {
                File = request.File
            });

            var currentPhoto = await dataService.UserDocuments
                .Where(sd => sd.UserId == request.userId &&
                sd.DocumentType == DocumentType.UserSignature).ToListAsync();

            dataService.UserDocuments.AttachRange(currentPhoto);

            dataService.UserDocuments.RemoveRange(currentPhoto);
            await dataService.SaveAsync(cancellationToken);

            dataService.UserDocuments.Add(new Domain.User.UserDocument()
            {
                UserId = request.userId,
                DocumentType = DocumentType.UserSignature,
                DocumentId = document.Id,
                FileName = document.FileName
            });

            await dataService.SaveAsync(cancellationToken);
            var latestPhoto = await (from ed in dataService.UserDocuments
                                     join d in dataService.Documents on ed.DocumentId equals d.Id
                                     where ed.UserId == request.userId &&
                                           ed.DocumentType == DocumentType.UserSignature &&
                                           (ed.IsDeleted == null || ed.IsDeleted == false)
                                     select d)
                          .FirstOrDefaultAsync(cancellationToken);

            return latestPhoto!;
        }
    }
}