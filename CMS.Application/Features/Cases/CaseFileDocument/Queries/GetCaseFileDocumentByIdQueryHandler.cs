using CMS.Application.EmployeeFile;
using CMS.Application.Features.EmployeeFileDocument.Dto;
using CMS.Application.Features.EmployeeFileDocument.Queries;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CMS.Application.Features.Cases.CaseFileDocument.Queries
{
    public class GetCaseFileDocumentByIdHandler : IRequestHandler<GetCaseFileDocumentByIdQuery, CaseFileDocumentDto>
    {
        private readonly IDataService _db;
        private readonly IFileService _fileService;
        private readonly ILogger<GetCaseFileDocumentByIdHandler> _logger;

        public GetCaseFileDocumentByIdHandler(IDataService db, IFileService fileService, ILogger<GetCaseFileDocumentByIdHandler> logger)
        {
            _db = db;
            _fileService = fileService;
            _logger = logger;
        }

        public async Task<CaseFileDocumentDto?> Handle(GetCaseFileDocumentByIdQuery request, CancellationToken cancellationToken)
        {
            var result = await _db.CaseFileDocuments
                            .Include(x => x.Case)
                            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (result == null)
            {
                _logger.LogWarning("Document with ID {Id} not found", request.Id);
                return null;
            }

            var employee = await _db.Cases
                            .FirstOrDefaultAsync(x => x.Id == result.CaseId, cancellationToken);

            if (employee == null)
            {
                _logger.LogWarning("Case with ID {CaseId} not found for document {Id}", result.Id, request.Id);
                return null;
            }

            return new CaseFileDocumentDto
            {
                Id = result.Id,
                CaseId = result.CaseId,
                CaseNumber = employee.CaseNumber,
                CaseDocumentType = result.CaseDocumentType,
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
