
using CMS.Domain.Enum;

namespace CMS.Application.Models;

public class WorkflowEnabledEntityDto
{
    public string? WorkflowComment { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;
    public string? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? SubmittedBy { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public string? RejectedBy { get; set; }
    public DateTime? RejectedAt { get; set; }
    public Guid VersionNumber { get; set; }
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
}
