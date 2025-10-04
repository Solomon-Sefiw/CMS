

using CMS.Application.Models;
using CMS.Domain;
using CMS.Domain.Adress;
using CMS.Domain.Courts;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Domain.Jobs;
using CMS.Domain.User;
using System.ComponentModel.DataAnnotations;

namespace CMS.Application.Features
{
    public class CaseDto:WorkflowEnabledEntityDto
    {

        public int Id { get; set; }
        [Required]
        public string CaseNumber { get; set; } = string.Empty;
        public CaseType CaseType { get; set; } = CaseType.Direct;
        public CaseStatus Status { get; set; } = CaseStatus.Pending;
        [Required]
        public string PlaintiffName { get; set; } = string.Empty;
        [Required]
        public string AccusedName { get; set; } = string.Empty;
        public string? Subject { get; set; }
        public DateTime FiledAt { get; set; } = DateTime.UtcNow;
        public DateTime? ClosedAt { get; set; }
        [Required]
        public string FiledById { get; set; } = string.Empty;
        public HRUser? FiledBy { get; set; }
        public string? AssignedJudgeId { get; set; }
        public HRUser? AssignedJudge { get; set; }
        public int BusinessUnitId { get; set; }
        public BusinessUnit? BusinessUnit { get; set; }
        public int? ChilotId { get; set; }
        public Chilot? Chilot { get; set; }

        public bool HasAddressInfo { get; set; }
        public bool HasContactInfo { get; set; }
        public bool HasEmployeeFamilyInfo { get; set; }
        public bool HasEmergencyContactInfo { get; set; }
        public bool HasLanguageSkillInfo { get; set; }
    }
}
