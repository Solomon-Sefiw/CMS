using CMS.Application.CaseFile;
using CMS.Application.Features.Cases.CaseFileDocument.AuditCaseFileDocument.Dto;
using CMS.Application.Features.EmployeeFileDocument.AuditEmployeeFileDocument.Dto;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Cases.CaseFileDocument.AuditCaseFileDocument.Query
{
    public class GetAuditCaseDocumentFileByCaseIdQueryHandler : IRequestHandler<GetAuditCaseDocumentFileByCaseIdQuery, List<AuditCaseFileDocumentDto>>
    {
        private readonly IDataService _dbContext;
        private readonly IAuditCaseFileDocumentService _auditService;

        public GetAuditCaseDocumentFileByCaseIdQueryHandler(IDataService dbContext, IAuditCaseFileDocumentService auditService)
        {
            _dbContext = dbContext;
            _auditService = auditService;
        }

        public async Task<List<AuditCaseFileDocumentDto>> Handle(GetAuditCaseDocumentFileByCaseIdQuery request, CancellationToken cancellationToken)
        {
            
            return await _auditService.GetLogsByCaseIdAsync(request.CaseId, cancellationToken);
        }
    }
}
