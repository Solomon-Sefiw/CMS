using CMS.Services.DataService;
using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.EmployeeFileDocument.Queries
{
    public class DownloadEmployeeFileDocumentHandler : IRequestHandler<DownloadEmployeeFileDocumentQuery, (Stream, string, string)>
    {
        private readonly IDataService _db;
        private readonly IConfiguration _config;

        public DownloadEmployeeFileDocumentHandler(IDataService db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public async Task<(Stream, string, string)> Handle(DownloadEmployeeFileDocumentQuery request, CancellationToken ct)
        {
            var doc = await _db.EmployeeFileDocuments.FindAsync(request.DocumentId);
            if (doc == null)
                throw new FileNotFoundException("Document not found");

            var fullPath = Path.Combine(_config["FileUploadBasePath"], doc.FilePath);
            if (!System.IO.File.Exists(fullPath))
                throw new FileNotFoundException("File not found on disk");

            var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
            return (stream, doc.ContentType, doc.FileName);
        }
    }

}
