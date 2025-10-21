
namespace CMS.Application.Features.EmployeeFileDocument.Queries
{
    using CMS.Application.EmployeeFile;
    using CMS.Application.Features.Cases.CaseFileDocument.Queries;
    using CMS.Application.Features.EmployeeFileDocument.Dto;
    using CMS.Domain.Cases.CaseDocument;
    using CMS.Domain.EmployeeDocument;
    using CMS.Services.DataService;
    using MediatR;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;

    public class GetCaseFileDocumentsByCaseIdQueryHandler : IRequestHandler<GetCaseFileDocumentsByCaseIdQuery, List<CaseFileDocumentDto>>
    {
        private readonly IDataService _dbContext;
        private readonly IFileService _fileService;

        public GetCaseFileDocumentsByCaseIdQueryHandler(IDataService dbContext, IFileService fileService)
        {
            _dbContext = dbContext;
            _fileService = fileService;
        }

        public async Task<List<CaseFileDocumentDto>> Handle(GetCaseFileDocumentsByCaseIdQuery request, CancellationToken cancellationToken)
        {
            IQueryable<CaseFileDocument> query;

            // Priority 1: ResignationId

                query = _dbContext.CaseFileDocuments
                    .Where(d => d.CaseId == request.CaseId);
            

            var documents = await query.ToListAsync(cancellationToken);

            var employee = await _dbContext.Cases
                .FirstOrDefaultAsync(e => e.Id == request.CaseId, cancellationToken);

            var result = new List<CaseFileDocumentDto>();

            foreach (var doc in documents)
            {
                var fileBytes = await _fileService.ReadFileAsync(doc.FilePath);

                result.Add(new CaseFileDocumentDto
                {
                    Id = doc.Id,
                    CaseId = doc.CaseId,
                    CaseNumber = employee?.CaseNumber,
                    ApprovalStatus = doc.ApprovalStatus,
                    CaseDocumentType = doc.CaseDocumentType,
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
