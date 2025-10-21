using CMS.Application.CaseFile;
using CMS.Application.EmployeeFile;
using CMS.Application.Features.EmployeeFileDocument.Commands;
using CMS.Common;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseFileDocument.Commands
{
    public class UpdateCaseFileDocumentHandler : IRequestHandler<UpdateCaseFileDocumentCommand, bool>
    {
        private readonly IDataService _db;
        private readonly IUserService _userService;
        private readonly IFileService _fileService;
        private readonly IAuditCaseFileDocumentService _auditService;
        private readonly string fileBasePath;

        public UpdateCaseFileDocumentHandler(
            IDataService db,
            IUserService userService,
            IFileService fileService,
            IAuditCaseFileDocumentService auditService,
            IConfiguration configuration)
        {
            _db = db;
            _userService = userService;
            _fileService = fileService;
            _auditService = auditService;
            fileBasePath = configuration["FileUploadBasePath"];
        }
        public async Task<bool> Handle(UpdateCaseFileDocumentCommand request, CancellationToken cancellationToken)
        {
           
            var document = await _db.CaseFileDocuments
                                .Include(d => d.Case)
                                .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);
            var oldFileName = document?.FileName;
            if (document == null)
                return false;

            var docType = Enum.Parse<CaseDocumentType>(request.CaseDocumentType, true);
            var subFolder = docType.ToString();
            var baseName = $"{document?.Case.CaseNumber ?? "Unknown"}-{document.Case.Id}-{subFolder}".Replace(" ", "_");

            if (request.File != null && request.File.Length > 0)
            {
                var fileExtension = Path.GetExtension(request.File.FileName).ToLowerInvariant();
                //var newFileName = baseName + fileExtension;
                var uniqueSuffix = Guid.NewGuid().ToString().Substring(0, 8);
                var newFileName = $"{document.Case.CaseNumber}-{document.Case.Id}-{subFolder}-{uniqueSuffix}"
                    .Replace(" ", "_") + fileExtension;


                if (!string.IsNullOrWhiteSpace(document.FileName))
                {
                    // Locate current file from base path instead of DB path
                    var currentFilePath = Path.Combine(fileBasePath, subFolder, document.FileName);

                    if (File.Exists(currentFilePath))
                    {
                        var backupFolder = Path.Combine(fileBasePath,subFolder, "OldVersions", document.CaseId.ToString());
                        Directory.CreateDirectory(backupFolder);

                        var backupFileName = $"{Path.GetFileNameWithoutExtension(document.FileName)}_{DateTime.UtcNow:yyyyMMddHHmmss}{Path.GetExtension(document.FileName)}";
                        var backupPath = Path.Combine(backupFolder, backupFileName);

                        File.Move(currentFilePath, backupPath);
                    }
                }

                var newFilePath = await _fileService.SaveFileAsync(request.File, subFolder, newFileName, request.Remark);

                document.FilePath = newFilePath;
                document.FileName = newFileName;
                document.ContentType = request.File.ContentType;
                document.Remark = request.Remark;
            }
            else
            {
                var fileExtension = Path.GetExtension(document.FileName).ToLowerInvariant();
                var newFileName = baseName + fileExtension;
                document.FileName = newFileName;
            }
            document.CaseDocumentType = docType;
            document.ModifiedAt = DateTime.UtcNow;
            document.ModifiedBy = _userService.GetCurrentUserFullName();
            document.ApprovalStatus = document.Case?.ApprovalStatus;
            document.Remark = request.Remark;
            await _db.SaveAsync(cancellationToken);
            await _auditService.LogAsync(
           entityName: nameof(CaseFileDocument),
           actionType: "Update",
           performedBy: _userService.GetCurrentUserFullName(),
           performedByUserId: _userService.GetCurrentUserId(),
           affectedCaseName: document.Case.CaseNumber,
           oldFileName:oldFileName,
           newFileName:document.FileName ,
           remark:request.Remark,
           affectedCaseId: document.CaseId,
           details: $"Updated '{document.FileName}' for Case {document.Case?.CaseNumber} {document.Case?.AccusedName} (ID: {document.Case?.Id}).",
           cancellationToken: cancellationToken
       );
            return true;
        }
    }
}
