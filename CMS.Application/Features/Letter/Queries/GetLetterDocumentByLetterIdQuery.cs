using CMS.Application.EmployeeFile;
using CMS.Application.Features.Letter.Models;
using CMS.Common;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;


namespace CMS.Application.Features.Letter.Queries
{
    public record GetLetterDocumentByLetterIdQuery : IRequest<LetterDocumentDto>
    {
        public int LetterId { get; set; }
    }
    public class GetLetterDocumentByLetterIdQueryHandler
        : IRequestHandler<GetLetterDocumentByLetterIdQuery, LetterDocumentDto>
    {
        private readonly IDataService dataService;
        private readonly IUserService userService;
        private readonly IFileService fileService;
        private readonly string basePath;

        public GetLetterDocumentByLetterIdQueryHandler(
            IDataService dataService,
            IUserService userService,
            IFileService fileService,
            IConfiguration configuration)
        {
            this.dataService = dataService;
            this.userService = userService;
            this.fileService = fileService;
            this.basePath = configuration["FileUploadBasePath"]
                ?? throw new ArgumentNullException(nameof(configuration), "FileUploadBasePath not configured.");
        }

        public async Task<LetterDocumentDto> Handle(GetLetterDocumentByLetterIdQuery request, CancellationToken cancellationToken)
        {
            var document = await dataService.LetterDocuments
                .Where(d => d.LetterId == request.LetterId)
                .Select(d => new LetterDocumentDto
                {
                    Id = d.Id,
                    LetterId = d.LetterId,
                    FileName = d.FileName,
                    FilePath = d.FilePath,
                    ContentType = d.ContentType,
                    Remark = d.Remark,
                    CreatedBy = d.CreatedBy,
                    CreatedAt = (DateTime)d.CreatedAt
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (document == null)
                return null;

            var fullPath = Path.Combine(basePath, document.FilePath.Replace('/', Path.DirectorySeparatorChar));

            if (!File.Exists(fullPath))
                document.Remark += " (Warning: File not found on disk)";

            document.FullPhysicalPath = fullPath;

            return document;
        }
    }
}
