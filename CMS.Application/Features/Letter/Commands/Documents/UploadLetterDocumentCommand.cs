using CMS.Common;
using CMS.Domain.LetterDocuments;
using CMS.Services.DataService;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace CMS.Application.Features.Letter.Commands.Documents
{
    public class UploadLetterDocumentCommand : IRequest<Guid>
    {
        [FromForm]
        public int LetterId { get; set; }
        [FromForm]
        public IFormFile File { get; set; } = default!;

        [FromForm]
        public string? Remark { get; set; }
    }

    public class UploadLetterDocumentCommandHandler : IRequestHandler<UploadLetterDocumentCommand, Guid>
    {
        private readonly IDataService dataService;
        private readonly IUserService userService;
        private readonly string basePath;

        public UploadLetterDocumentCommandHandler(
            IDataService dataService,
            IUserService userService,
            IConfiguration configuration)
        {
            this.dataService = dataService;
            this.userService = userService;
            this.basePath = configuration["FileUploadBasePath"]
                ?? throw new ArgumentNullException(nameof(configuration), "FileUploadBasePath not configured.");
        }

        public async Task<Guid> Handle(UploadLetterDocumentCommand request, CancellationToken cancellationToken)
        {
            // Fetch the letter record
            var letter = await dataService.Letters
                .FirstOrDefaultAsync(l => l.Id == request.LetterId, cancellationToken);

            if (letter == null)
                throw new Exception($"Letter with ID {request.LetterId} not found.");

            var letterSubject = letter.Subject?.Trim().Replace(" ", "_") ?? $"Letter_{letter.Id}";
            var baseFolder = Path.Combine(basePath, "LetterDocuments", letterSubject);

            if (!Directory.Exists(baseFolder))
                Directory.CreateDirectory(baseFolder);

            // Check if document already exists for this letter
            var existingDoc = await dataService.LetterDocuments
                .FirstOrDefaultAsync(d => d.LetterId == request.LetterId, cancellationToken);

            Guid documentId;
            var extension = Path.GetExtension(request.File.FileName);

            if (existingDoc != null)
            {
                documentId = existingDoc.Id;

                // Delete old file if exists
                var oldFullPath = Path.Combine(basePath, existingDoc.FilePath.Replace("/", "\\"));
                if (File.Exists(oldFullPath))
                {
                    try { File.Delete(oldFullPath); } catch { /* ignore errors */ }
                }

                // Generate new filename
                var fileName = $"{letterSubject}_{documentId}{extension}";
                var fullPath = Path.Combine(baseFolder, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await request.File.CopyToAsync(stream, cancellationToken);
                }

                var relativePath = Path.Combine("LetterDocuments", letterSubject, fileName).Replace("\\", "/");

                existingDoc.FileName = fileName;
                existingDoc.FilePath = relativePath;
                existingDoc.ContentType = request.File.ContentType;
                existingDoc.Remark = request.Remark;
                existingDoc.ModifiedAt = DateTime.UtcNow;
                existingDoc.ModifiedBy = userService.GetCurrentUserFullName() ?? "system";

                await dataService.SaveAsync(cancellationToken);
                return existingDoc.Id;
            }
            else
            {
                // Create new document
                var newDoc = new LetterDocument
                {
                    Id = Guid.NewGuid(),
                    LetterId = request.LetterId,
                    ContentType = request.File.ContentType,
                    Remark = request.Remark,
                    CreatedBy = userService.GetCurrentUserFullName() ?? "system",
                    CreatedAt = DateTime.UtcNow
                };

                documentId = newDoc.Id;

                var fileName = $"{letterSubject}_{documentId}{extension}";
                var fullPath = Path.Combine(baseFolder, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await request.File.CopyToAsync(stream, cancellationToken);
                }

                var relativePath = Path.Combine("LetterDocuments", letterSubject, fileName).Replace("\\", "/");

                newDoc.FileName = fileName;
                newDoc.FilePath = relativePath;

                await dataService.LetterDocuments.AddAsync(newDoc);
                await dataService.SaveAsync(cancellationToken);
                return newDoc.Id;
            }
        }
    }
}




