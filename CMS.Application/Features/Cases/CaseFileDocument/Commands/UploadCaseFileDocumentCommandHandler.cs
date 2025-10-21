using CMS.Application.CaseFile;
using CMS.Application.EmployeeFile;
using CMS.Common;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application.Features.Cases.CaseFileDocument.Commands
{
    public class UploadCaseFileDocumentHandler : IRequestHandler<UploadCaseFileDocumentCommand, Guid>
    {
        private readonly IDataService _db;
        private readonly IFileService _fileService;
        private readonly IUserService _userService;
        private readonly IAuditCaseFileDocumentService _auditService;

        public UploadCaseFileDocumentHandler(IDataService db, IFileService fileService,IUserService userService, IAuditCaseFileDocumentService auditCaseFileDocumentService)
        {
            _db = db;
            _fileService = fileService;
            _userService = userService;
            _auditService= auditCaseFileDocumentService;
        }

        public async Task<Guid> Handle(UploadCaseFileDocumentCommand request, CancellationToken cancellationToken)
        {
            var employee = await _db.Cases
                .FirstOrDefaultAsync(x => x.Id == request.CaseId, cancellationToken);
            var subFolder = request.CaseDocumentType.ToString();
            //var fileName = $"{employee?.FirstName}-{employee?.Id}-{subFolder}".Replace(" ", "_")
            // + Path.GetExtension(request.File.FileName);
            var uniqueSuffix = Guid.NewGuid().ToString().Substring(0, 8); // short unique ID
            var fileName = $"{employee?.CaseNumber}-{employee?.Id}-{subFolder}-{uniqueSuffix}"
                .Replace(" ", "_") + Path.GetExtension(request.File.FileName);
            var relativePath = await _fileService.SaveFileAsync(request.File,subFolder,fileName, request.Remark);

            var document = new Domain.Cases.CaseDocument.CaseFileDocument
            {
                Id = Guid.NewGuid(),
                CaseId = request.CaseId,
                CaseDocumentType = request.CaseDocumentType,
                FileName = fileName,
                FilePath = relativePath,
                ContentType = request.File.ContentType,
                Remark=request.Remark,
                CreatedBy = _userService.GetCurrentUserFullName(),
                CreatedAt = DateTime.UtcNow,
                ApprovalStatus = employee.ApprovalStatus,
            };

            try
            {
                _db.CaseFileDocuments.Add(document);
                await _db.SaveAsync(cancellationToken);
            }
            catch (DbUpdateException ex)
            {
                var inner = ex.InnerException?.Message ?? ex.Message;
                throw new InvalidOperationException($"DB Save failed: {inner}", ex);
            }

            await _auditService.LogAsync(
           entityName: nameof(CaseFileDocument),
           actionType: "upload",
           performedBy: _userService.GetCurrentUserFullName(),
           performedByUserId: _userService.GetCurrentUserId(),
           affectedCaseName:employee?.CaseNumber,
           oldFileName: fileName,
           newFileName: fileName,
           remark:request.Remark,
           affectedCaseId: document.CaseId,
           details: $"uploaded '{document.FileName}' for Case {employee?.CaseNumber} {employee?.AccusedName} (ID: {employee?.Id}).",
           cancellationToken: cancellationToken
       );
            return document.Id;
        }
    }

}
