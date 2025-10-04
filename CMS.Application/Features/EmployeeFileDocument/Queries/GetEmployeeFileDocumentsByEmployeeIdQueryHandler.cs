
namespace CMS.Application.Features.EmployeeFileDocument.Queries
{
    using CMS.Application.EmployeeFile;
    using CMS.Application.Features.EmployeeFileDocument.Dto;
    using CMS.Domain.EmployeeDocument;
    using CMS.Services.DataService;
    using MediatR;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;

    public class GetEmployeeFileDocumentsByEmployeeIdQueryHandler : IRequestHandler<GetEmployeeFileDocumentsByEmployeeIdQuery, List<EmployeeFileDocumentDto>>
    {
        private readonly IDataService _dbContext;
        private readonly IFileService _fileService;

        public GetEmployeeFileDocumentsByEmployeeIdQueryHandler(IDataService dbContext, IFileService fileService)
        {
            _dbContext = dbContext;
            _fileService = fileService;
        }

        public async Task<List<EmployeeFileDocumentDto>> Handle(GetEmployeeFileDocumentsByEmployeeIdQuery request, CancellationToken cancellationToken)
        {
            IQueryable<EmployeeFileDocument> query;

            // Priority 1: ResignationId
            if (request.ResignationId.HasValue && request.ResignationId.Value > 0)
            {
                query = _dbContext.EmployeeFileDocuments
                    .Where(d => d.ResignationId == request.ResignationId.Value);
            }
            // Priority 2: SuspensionId
            else if (request.SuspensionId.HasValue && request.SuspensionId.Value > 0)
            {
                query = _dbContext.EmployeeFileDocuments
                    .Where(d => d.SuspensionId == request.SuspensionId.Value);
            }
            // Priority 3: EmployeeId
            else
            {
                query = _dbContext.EmployeeFileDocuments
                    .Where(d => d.EmployeeId == request.EmployeeId);
            }

            var documents = await query.ToListAsync(cancellationToken);

            var employee = await _dbContext.Employees
                .FirstOrDefaultAsync(e => e.Id == request.EmployeeId, cancellationToken);

            var result = new List<EmployeeFileDocumentDto>();

            foreach (var doc in documents)
            {
                var fileBytes = await _fileService.ReadFileAsync(doc.FilePath);

                result.Add(new EmployeeFileDocumentDto
                {
                    Id = doc.Id,
                    EmployeeId = doc.EmployeeId,
                    ResignationId = doc.ResignationId,
                    SuspensionId = doc.SuspensionId,
                    FirstName = employee?.FirstName,
                    MiddleName = employee?.MiddleName,
                    LastName = employee?.LastName,
                    ApprovalStatus = doc.ApprovalStatus,
                    DocumentType = doc.DocumentType,
                    FileName = doc.FileName,
                    ContentType = doc.ContentType,
                    FileContent = fileBytes,
                    CreatedAt = doc.CreatedAt,
                    ModifiedAt = doc.ModifiedAt,
                    CreatedBy = doc.CreatedBy,
                    ModifiedBy = doc.ModifiedBy,
                    Remark = doc.Remark,
                });
            }

            return result;
        }


    }

}
