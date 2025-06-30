using CMS.Domain.Document;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application;

public record GetDocumentQuery(string Id) : IRequest<Document?>;


public class GetDocumentQueryHandler : IRequestHandler<GetDocumentQuery, Document?>
{
    private readonly IDataService dataService;

    public GetDocumentQueryHandler(IDataService dataService)
    {
        this.dataService = dataService;
    }


    public async Task<Document?> Handle(GetDocumentQuery request, CancellationToken cancellationToken)
    {

        var document = await (from ed in dataService.UserDocuments
                              join d in dataService.Documents on ed.DocumentId equals d.Id
                              where ed.DocumentId == request.Id &&
                                    ed.DocumentType == DocumentType.UserSignature &&
                                    (ed.IsDeleted == null || ed.IsDeleted == false)
                              select d)
                     .FirstOrDefaultAsync(cancellationToken);

        return document;
    }
}