using CMS.Common;
using CMS.Services.DataService;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Letter.Commands.Documents
{
        public class UpdateLetterDocumentCommand : IRequest<Guid>
        {
            public Guid DocumentId { get; set; }
            public IFormFile File { get; set; } = default!;
            public string? Remark { get; set; }
        }

        public class UpdateLetterDocumentCommandHandler : IRequestHandler<UpdateLetterDocumentCommand, Guid>
        {
            private readonly IDataService dataService;
            private readonly IUserService userService;
            private readonly string basePath;

            public UpdateLetterDocumentCommandHandler(
                IDataService dataService,
                IUserService userService,
                IConfiguration configuration)
            {
                this.dataService = dataService;
                this.userService = userService;
                this.basePath = configuration["FileUploadBasePath"]
                    ?? throw new ArgumentNullException(nameof(configuration), "FileUploadBasePath not configured.");
            }

            public async Task<Guid> Handle(UpdateLetterDocumentCommand request, CancellationToken cancellationToken)
            {
                var existingDoc = await dataService.LetterDocuments
                    .Include(d => d.Letter)
                    .FirstOrDefaultAsync(d => d.Id == request.DocumentId, cancellationToken);

                if (existingDoc == null)
                    throw new Exception($"Letter document with ID {request.DocumentId} not found.");

                var letter = existingDoc.Letter ?? throw new Exception("Related letter not found.");

                var letterSubject = letter.Subject?.Trim().Replace(" ", "_") ?? $"Letter_{letter.Id}";
                var baseFolder = Path.Combine(basePath, "LetterDocuments", letterSubject);

                if (!Directory.Exists(baseFolder))
                    Directory.CreateDirectory(baseFolder);

                // Remove old file
                var oldFullPath = Path.Combine(basePath, existingDoc.FilePath.Replace("/", "\\"));
                if (File.Exists(oldFullPath))
                {
                    try { File.Delete(oldFullPath); } catch { }
                }

                var extension = Path.GetExtension(request.File.FileName);
                var sanitizedFileName = Path.GetFileNameWithoutExtension(request.File.FileName)
                                            .Replace(" ", "_")
                                            .Replace("/", "_")
                                            .Replace("\\", "_");

                var fileName = $"{sanitizedFileName}_{existingDoc.Id}{extension}";
                var fullPath = Path.Combine(baseFolder, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await request.File.CopyToAsync(stream, cancellationToken);
                }

                var relativePath = Path.Combine("LetterDocuments", letterSubject, fileName).Replace("\\", "/");

                existingDoc.FileName = fileName;
                existingDoc.FilePath = relativePath;
                existingDoc.ContentType = request.File.ContentType;
                existingDoc.Remark = request.Remark ?? existingDoc.Remark;
                existingDoc.ModifiedAt = DateTime.UtcNow;
                existingDoc.ModifiedBy = userService.GetCurrentUserFullName() ?? "system";

                dataService.LetterDocuments.Update(existingDoc);
                await dataService.SaveAsync(cancellationToken);

                return existingDoc.Id;
            }
        }
}
