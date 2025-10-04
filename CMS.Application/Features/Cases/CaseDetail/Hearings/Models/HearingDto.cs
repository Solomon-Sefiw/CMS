using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Hearings.Models
{
    public class HearingDto
    {
        public int Id { get; set; }
        public int CaseId { get; set; }
        public string? CaseNumber { get; set; }
        public DateTime ScheduledAt { get; set; }
        public HearingType HearingType { get; set; }
        public string? LocationOrUrl { get; set; }
        public string? ResponsibleJudgeId { get; set; }
        public string? ResponsibleJudgeName { get; set; }
        public int? ChilotId { get; set; }
        public string? ChilotName { get; set; }
        public int? BusinessUnitId { get; set; }
        public string? BusinessUnitName { get; set; }
        public string? Notes { get; set; }
        public List<HearingParticipantDto> Participants { get; set; } = new();
    }

    public class HearingParticipantDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public string? Role { get; set; }
    }
}
