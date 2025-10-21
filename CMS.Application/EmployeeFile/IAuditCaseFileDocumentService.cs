using CMS.Application.Features.Cases.CaseFileDocument.AuditCaseFileDocument.Dto;
using CMS.Application.Features.EmployeeFileDocument.AuditEmployeeFileDocument.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CMS.Application.CaseFile
{
    public interface IAuditCaseFileDocumentService
    {
        Task LogAsync(
                string entityName,
                string actionType,
                string performedBy,
                string? performedByUserId,
                string affectedCaseName,
                int? affectedCaseId,
                string? oldFileName,
                string? newFileName,
                string details,
                string remark,
                CancellationToken cancellationToken = default
            );
       
        Task<List<AuditCaseFileDocumentDto>> GetAllLogsAsync(CancellationToken cancellationToken = default);

        Task<List<AuditCaseFileDocumentDto>> GetLogsByCaseIdAsync(int caseId, CancellationToken cancellationToken = default);
    }
}
