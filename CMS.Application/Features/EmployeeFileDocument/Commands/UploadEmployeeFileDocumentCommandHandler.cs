using CMS.Application.EmployeeFile;
using CMS.Common;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application.Features.EmployeeFileDocument.Commands
{
    public class UploadEmployeeFileDocumentHandler : IRequestHandler<UploadEmployeeFileDocumentCommand, Guid>
    {
        private readonly IDataService _db;
        private readonly IFileService _fileService;
        private readonly IUserService _userService;
        private readonly IAuditEmployeeFileDocumentService _auditService;

        public UploadEmployeeFileDocumentHandler(IDataService db, IFileService fileService,IUserService userService, IAuditEmployeeFileDocumentService auditEmployeeFileDocumentService)
        {
            _db = db;
            _fileService = fileService;
            _userService = userService;
            _auditService= auditEmployeeFileDocumentService;
        }

        public async Task<Guid> Handle(UploadEmployeeFileDocumentCommand request, CancellationToken cancellationToken)
        {
            var employee = await _db.Employees
                .FirstOrDefaultAsync(x => x.Id == request.EmployeeId, cancellationToken);
            var subFolder = request.DocumentType.ToString();
            //var fileName = $"{employee?.FirstName}-{employee?.Id}-{subFolder}".Replace(" ", "_")
            // + Path.GetExtension(request.File.FileName);
            var uniqueSuffix = Guid.NewGuid().ToString().Substring(0, 8); // short unique ID
            var fileName = $"{employee?.FirstName}-{employee?.Id}-{subFolder}-{uniqueSuffix}"
                .Replace(" ", "_") + Path.GetExtension(request.File.FileName);
            var relativePath = await _fileService.SaveFileAsync(request.File,subFolder,fileName, request.Remark);

            var document = new Domain.EmployeeDocument.EmployeeFileDocument
            {
                Id = Guid.NewGuid(),
                EmployeeId = request.EmployeeId,
                ResignationId = request.ResignationId,
                SuspensionId = request.SuspensionId,
                DocumentType = request.DocumentType,
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
                _db.EmployeeFileDocuments.Add(document);
                await _db.SaveAsync(cancellationToken);
            }
            catch (DbUpdateException ex)
            {
                var inner = ex.InnerException?.Message ?? ex.Message;
                throw new InvalidOperationException($"DB Save failed: {inner}", ex);
            }

            await _auditService.LogAsync(
           entityName: nameof(EmployeeFileDocument),
           actionType: "upload",
           performedBy: _userService.GetCurrentUserFullName(),
           performedByUserId: _userService.GetCurrentUserId(),
           affectedEmployeeName:employee?.FirstName,
           oldFileName: fileName,
           newFileName: fileName,
           remark:request.Remark,
           affectedEmployeeId: document.EmployeeId,
           details: $"uploaded '{document.FileName}' for employee {employee?.FirstName} {employee?.LastName} (ID: {employee?.Id}).",
           cancellationToken: cancellationToken
       );
            return document.Id;
        }
    }

}
