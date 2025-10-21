using CMS.Application.Features.EmployeeFileDocument.Queries;
using CMS.Services.DataService;
using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseFileDocument.Queries
{
    public class DownloadCaseFileDocumentHandler : IRequestHandler<DownloadCaseFileDocumentQuery, (Stream, string, string)>
    {
        private readonly IDataService _db;
        private readonly IConfiguration _config;

        public DownloadCaseFileDocumentHandler(IDataService db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public async Task<(Stream, string, string)> Handle(DownloadCaseFileDocumentQuery request, CancellationToken ct)
        {
            var doc = await _db.CaseFileDocuments.FindAsync(request.DocumentId);
            if (doc == null)
                throw new FileNotFoundException("Document not found");

            var fullPath = Path.Combine(_config["FileUploadBasePath"], doc.FilePath);
            if (!File.Exists(fullPath))
                throw new FileNotFoundException("File not found on disk");

            var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
            return (stream, doc.ContentType, doc.FileName);
        }
    }

}
