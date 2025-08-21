using CMS.Application.EmployeeFile;
using CMS.Application.Features.EmployeeFileDocument.AuditEmployeeFileDocument.Dto;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.EmployeeFileDocument.AuditEmployeeFileDocument.Query
{
    public class GetAuditEmployeeFileDocumentLogsHandler : IRequestHandler<GetAuditEmployeeFileDocumentLogs, List<AuditEmployeeFileDocumentDto>>
    {
        private readonly IDataService _dbContext;
        private readonly IAuditEmployeeFileDocumentService _auditService;
        public GetAuditEmployeeFileDocumentLogsHandler(IDataService dbContext, IAuditEmployeeFileDocumentService auditService)
        {
            _dbContext = dbContext;
            _auditService = auditService;
        }
        public async Task<List<AuditEmployeeFileDocumentDto>> Handle(GetAuditEmployeeFileDocumentLogs request, CancellationToken cancellationToken)
        {
            
            return await _auditService.GetAllLogsAsync(cancellationToken);



        }
    }
}
