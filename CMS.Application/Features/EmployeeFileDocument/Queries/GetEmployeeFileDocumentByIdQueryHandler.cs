using CMS.Application.EmployeeFile;
using CMS.Application.Features.EmployeeFileDocument.Dto;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CMS.Application.Features.EmployeeFileDocument.Queries
{
    public class GetEmployeeFileDocumentByIdHandler : IRequestHandler<GetEmployeeFileDocumentByIdQuery, EmployeeFileDocumentDto>
    {
        private readonly IDataService _db;
        private readonly IFileService _fileService;
        private readonly ILogger<GetEmployeeFileDocumentByIdHandler> _logger;

        public GetEmployeeFileDocumentByIdHandler(IDataService db, IFileService fileService, ILogger<GetEmployeeFileDocumentByIdHandler> logger)
        {
            _db = db;
            _fileService = fileService;
            _logger = logger;
        }

        public async Task<EmployeeFileDocumentDto?> Handle(GetEmployeeFileDocumentByIdQuery request, CancellationToken cancellationToken)
        {
            var result = await _db.EmployeeFileDocuments
                            .Include(x => x.Employee)
                            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (result == null)
            {
                _logger.LogWarning("Document with ID {Id} not found", request.Id);
                return null;
            }

            var employee = await _db.Employees
                            .FirstOrDefaultAsync(x => x.Id == result.EmployeeId, cancellationToken);

            if (employee == null)
            {
                _logger.LogWarning("Employee with ID {EmployeeId} not found for document {Id}", result.EmployeeId, request.Id);
                return null;
            }

            return new EmployeeFileDocumentDto
            {
                Id = result.Id,
                EmployeeId = result.EmployeeId,
                FirstName = employee.FirstName,
                MiddleName = employee.MiddleName,
                LastName = employee.LastName,
                DocumentType = result.DocumentType,
                FileName = result.FileName,
                FilePath = result.FilePath,
                ContentType = result.ContentType,
                ApprovalStatus = result.ApprovalStatus,
                CreatedAt = result.CreatedAt,
                ModifiedAt = result.ModifiedAt,
                CreatedBy = result.CreatedBy,
                ModifiedBy = result.ModifiedBy,
                Remark=result.Remark,
            };
        }
    }

}
