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

        return await dataService.Documents
            .Where(doc => doc.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken);

    }
}