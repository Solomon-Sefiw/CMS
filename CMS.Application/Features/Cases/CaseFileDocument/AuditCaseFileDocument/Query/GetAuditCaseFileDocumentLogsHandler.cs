using CMS.Application.CaseFile;
using CMS.Application.EmployeeFile;
using CMS.Application.Features.Cases.CaseFileDocument.AuditCaseFileDocument.Dto;
using CMS.Application.Features.EmployeeFileDocument.AuditEmployeeFileDocument.Dto;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseFileDocument.AuditCaseFileDocument.Query
{
    public class GetAuditCaseFileDocumentLogsHandler : IRequestHandler<GetAuditCaseFileDocumentLogs, List<AuditCaseFileDocumentDto>>
    {
        private readonly IDataService _dbContext;
        private readonly IAuditCaseFileDocumentService _auditService;   
        public GetAuditCaseFileDocumentLogsHandler(IDataService dbContext, IAuditCaseFileDocumentService auditService)
        {
            _dbContext = dbContext;
            _auditService = auditService;
        }
        public async Task<List<AuditCaseFileDocumentDto>> Handle(GetAuditCaseFileDocumentLogs request, CancellationToken cancellationToken)
        {
            
            return await _auditService.GetAllLogsAsync(cancellationToken);



        }
    }
}
