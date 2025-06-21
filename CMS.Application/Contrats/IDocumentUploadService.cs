using CMS.Domain.Document;
using Microsoft.AspNetCore.Http;

namespace CMS.Application.Contrats
{
    public interface IDocumentUploadService
    {
        Task<Document> Upload(IFormFile file, CancellationToken cancellationToken);
        Task Delete(int id, CancellationToken cancellationToken);
    }
}
