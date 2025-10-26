using CMS.Application.EmployeeFile;
using CMS.Application.Features.Letter.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Letter.Queries
{
    public record GetLetterDocumentByIdQuery : IRequest<LetterDocumentDto>
    {
        public Guid Id { get; set; }
    }

    public class GetLetterDocumentByIdQueryHandler : IRequestHandler<GetLetterDocumentByIdQuery, LetterDocumentDto>
    {
        private readonly IDataService _dataService;
        private readonly IFileService _fileService;
        private readonly ILogger<GetLetterDocumentByIdQueryHandler> _logger;
        private readonly string _basePath;

        public GetLetterDocumentByIdQueryHandler(
            IDataService dataService,
            IFileService fileService,
            ILogger<GetLetterDocumentByIdQueryHandler> logger,
            IConfiguration configuration)
        {
            _dataService = dataService;
            _fileService = fileService;
            _logger = logger;
            _basePath = configuration["FileUploadBasePath"]
                ?? throw new ArgumentNullException(nameof(configuration), "FileUploadBasePath not configured.");
        }

        public async Task<LetterDocumentDto?> Handle(GetLetterDocumentByIdQuery request, CancellationToken cancellationToken)
        {
            var result = await _dataService.LetterDocuments
                .Include(x => x.Letter)
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (result == null)
            {
                _logger.LogWarning("Document with ID {Id} not found", request.Id);
                return null;
            }

            var letter = await _dataService.Letters
                .FirstOrDefaultAsync(x => x.Id == result.LetterId, cancellationToken);

            if (letter == null)
            {
                _logger.LogWarning("Letter with ID {LetterId} not found for document {Id}", result.LetterId, request.Id);
                return null;
            }

            var fullPath = System.IO.Path.Combine(_basePath, result.FilePath.Replace('/', System.IO.Path.DirectorySeparatorChar));

            return new LetterDocumentDto
            {
                Id = result.Id,
                LetterId = result.LetterId,
                FileName = result.FileName,
                FilePath = result.FilePath,
                ContentType = result.ContentType,
                Remark = result.Remark,
                CreatedBy = result.CreatedBy,
                CreatedAt = (DateTime)result.CreatedAt,
                FullPhysicalPath = fullPath
            };
        }
    }
}
