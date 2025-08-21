using CMS.Application.EmployeeFile;
using CMS.Application.Features.EmployeeFileDocument.AuditEmployeeFileDocument.Dto;
using CMS.Domain.EmployeeDocument;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class AuditEmployeeFileDocumentService : IAuditEmployeeFileDocumentService
{
    private readonly IDataService _db;
    private readonly string _logDirectory;

    public AuditEmployeeFileDocumentService(IDataService db,IConfiguration configuration)
    {
        _db = db;
        _logDirectory = configuration["AuditFileUploadLogging:Directory"]
                        ?? throw new ArgumentNullException("AuditFileUploadLogging:Directory");
        if (!Directory.Exists(_logDirectory))
        {
            Directory.CreateDirectory(_logDirectory);
        }
    }

    public async Task LogAsync(
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
        CancellationToken cancellationToken = default)
    {
        var log = new AuditEmployeeFileDocumentLog
        {
            EntityName = entityName,
            ActionType = actionType,
            PerformedBy = performedBy,
            PerformedByUserId = performedByUserId,
            AffectedEmployeeName = affectedEmployeeName,
            AffectedEmployeeId = affectedEmployeeId,
            OldFileName=oldFileName,
            NewFileName=newFileName,
            Details = details,
            Remark=remark,
            PerformedAt = DateTime.UtcNow
        };

        _db.AuditEmployeeFileDocumentLogs.Add(log);
        await _db.SaveAsync(cancellationToken);

        var filePath = Path.Combine(_logDirectory, $"EmployeeFileAudit-{DateTime.UtcNow:yyyy-MM-dd}.log");

        var logLine = $"[{log.PerformedAt:yyyy-MM-dd HH:mm:ss}] Action: {actionType}, " +
                      $"PerformedBy: {performedBy} ({performedByUserId}), " +
                      $"Employee: {affectedEmployeeName} ({affectedEmployeeId}), " +
                      $"OldFileName: {oldFileName}, NewFileName: {newFileName}, Details: {details}";

        try
        {
            await File.AppendAllTextAsync(filePath, logLine + Environment.NewLine, cancellationToken);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to write audit log to file: {ex.Message}");
        }
    }
    public async Task<List<AuditEmployeeFileDocumentDto>> GetAllLogsAsync(CancellationToken cancellationToken = default)
    {
        return await _db.AuditEmployeeFileDocumentLogs
            .OrderByDescending(x => x.PerformedAt)
            .Select(x => new AuditEmployeeFileDocumentDto
            {
                EntityName = x.EntityName,
                ActionType = x.ActionType,
                PerformedBy = x.PerformedBy,
                PerformedByUserId = x.PerformedByUserId,
                AffectedEmployeeName = x.AffectedEmployeeName,
                OldFileName=x.OldFileName,
                NewFileName=x.NewFileName,
                AffectedEmployeeId = x.AffectedEmployeeId,
                Details = x.Details,
                Remark=x.Remark,
                PerformedAt = x.PerformedAt
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<List<AuditEmployeeFileDocumentDto>> GetLogsByEmployeeIdAsync(int employeeId, CancellationToken cancellationToken = default)
    {
        return await _db.AuditEmployeeFileDocumentLogs
            .Where(x => x.AffectedEmployeeId == employeeId)
            .OrderByDescending(x => x.PerformedAt)
            .Select(x => new AuditEmployeeFileDocumentDto
            {
                EntityName = x.EntityName,
                ActionType = x.ActionType,
                PerformedBy = x.PerformedBy,
                PerformedByUserId = x.PerformedByUserId,
                AffectedEmployeeName = x.AffectedEmployeeName,
                OldFileName= x.OldFileName,
                NewFileName= x.NewFileName,
                AffectedEmployeeId = x.AffectedEmployeeId,
                Details = x.Details,
                Remark=x.Remark,
                PerformedAt = x.PerformedAt
            })
            .ToListAsync(cancellationToken);


    }
}
