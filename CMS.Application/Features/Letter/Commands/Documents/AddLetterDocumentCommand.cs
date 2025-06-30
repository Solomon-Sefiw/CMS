using CMS.Application.Features.Documents.Commands;
using CMS.Domain.Document;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using static CMS.Application.Security.UserPermissions;

namespace CMS.Application.Features.Employees.Commands.Documents
{
    public record AddLetterDocumentCommand(int EmployeeId, IFormFile File) : IRequest<Document>;

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

            var currentPhoto = await dataService.EmployeeDocuments
                .Where(sd => sd.EmployeeId == request.EmployeeId &&
                sd.DocumentType == DocumentType.UserSignature).ToListAsync();

            dataService.EmployeeDocuments.AttachRange(currentPhoto);

            dataService.EmployeeDocuments.RemoveRange(currentPhoto);
            await dataService.SaveAsync(cancellationToken);

            dataService.EmployeeDocuments.Add(new EmployeeDocument()
            {
                EmployeeId = request.EmployeeId,
                DocumentType = DocumentType.UserSignature,
                DocumentId = document.Id,
                FileName = document.FileName
            });

            await dataService.SaveAsync(cancellationToken);
            var latestPhoto = await (from ed in dataService.EmployeeDocuments
                                     join d in dataService.Documents on ed.DocumentId equals d.Id
                                     where ed.EmployeeId == request.EmployeeId &&
                                           ed.DocumentType == DocumentType.UserSignature &&
                                           (ed.IsDeleted == null || ed.IsDeleted == false)
                                     select d)
                          .FirstOrDefaultAsync(cancellationToken);

            return latestPhoto!;
        }
    }
}