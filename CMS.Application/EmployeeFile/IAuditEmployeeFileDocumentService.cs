using CMS.Application.Features.EmployeeFileDocument.AuditEmployeeFileDocument.Dto;

namespace CMS.Application.EmployeeFile
{
    public interface IAuditEmployeeFileDocumentService
    {
        Task LogAsync(
                string entityName,
                string actionType,
                string performedBy,
                string? performedByUserId,
                string affectedEmployeeName,
                int? affectedEmployeeId,
                string? oldFileName,
                string? newFileName,
                string details,
                string remark,
                CancellationToken cancellationToken = default
            );
       
        Task<List<AuditEmployeeFileDocumentDto>> GetAllLogsAsync(CancellationToken cancellationToken = default);

        Task<List<AuditEmployeeFileDocumentDto>> GetLogsByEmployeeIdAsync(int employeeId, CancellationToken cancellationToken = default);
    }
}
