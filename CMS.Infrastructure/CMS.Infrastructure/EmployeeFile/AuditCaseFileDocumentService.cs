using CMS.Application.CaseFile;
using CMS.Application.Features.Cases.CaseFileDocument.AuditCaseFileDocument.Dto;
using CMS.Application.Features.EmployeeFileDocument.AuditEmployeeFileDocument.Dto;
using CMS.Domain.Cases.CaseDocument;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class AuditCaseFileDocumentService : IAuditCaseFileDocumentService
{
    private readonly IDataService _db;
    private readonly string _logDirectory;

    public AuditCaseFileDocumentService(IDataService db,IConfiguration configuration)
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
        string affectedCaseName,
        int? affectedCaseId,
        string? oldFileName,
        string? newFileName,
        string details,
        string remark,
        CancellationToken cancellationToken = default)
    {
        var log = new AuditCaseFileDocumentLog
        {
            EntityName = entityName,
            ActionType = actionType,
            PerformedBy = performedBy,
            PerformedByUserId = performedByUserId,
            AffectedCaseName = affectedCaseName,
            AffectedCaseId = affectedCaseId,
            OldFileName=oldFileName,
            NewFileName=newFileName,
            Details = details,
            Remark=remark,
            PerformedAt = DateTime.UtcNow
        };

        _db.AuditCaseFileDocumentLogs.Add(log);
        await _db.SaveAsync(cancellationToken);

        var filePath = Path.Combine(_logDirectory, $"CaseFileAudit-{DateTime.UtcNow:yyyy-MM-dd}.log");

        var logLine = $"[{log.PerformedAt:yyyy-MM-dd HH:mm:ss}] Action: {actionType}, " +
                      $"PerformedBy: {performedBy} ({performedByUserId}), " +
                      $"Case: {affectedCaseName} ({affectedCaseId}), " +
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
    public async Task<List<AuditCaseFileDocumentDto>> GetAllLogsAsync(CancellationToken cancellationToken = default)
    {
        return await _db.AuditCaseFileDocumentLogs
            .OrderByDescending(x => x.PerformedAt)
            .Select(x => new AuditCaseFileDocumentDto
            {
                EntityName = x.EntityName,
                ActionType = x.ActionType,
                PerformedBy = x.PerformedBy,
                PerformedByUserId = x.PerformedByUserId,
                AffectedCaseName = x.AffectedCaseName,
                OldFileName=x.OldFileName,
                NewFileName=x.NewFileName,
                AffectedCaseId = x.AffectedCaseId,
                Details = x.Details,
                Remark=x.Remark,
                PerformedAt = x.PerformedAt
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<List<AuditCaseFileDocumentDto>> GetLogsByCaseIdAsync(int caseId, CancellationToken cancellationToken = default)
    {
        return await _db.AuditCaseFileDocumentLogs
            .Where(x => x.AffectedCaseId == caseId)
            .OrderByDescending(x => x.PerformedAt)
            .Select(x => new AuditCaseFileDocumentDto
            {
                EntityName = x.EntityName,
                ActionType = x.ActionType,
                PerformedBy = x.PerformedBy,
                PerformedByUserId = x.PerformedByUserId,
                AffectedCaseName = x.AffectedCaseName,
                OldFileName= x.OldFileName,
                NewFileName= x.NewFileName,
                AffectedCaseId = x.AffectedCaseId,
                Details = x.Details,
                Remark=x.Remark,
                PerformedAt = x.PerformedAt
            })
            .ToListAsync(cancellationToken);


    }
}
