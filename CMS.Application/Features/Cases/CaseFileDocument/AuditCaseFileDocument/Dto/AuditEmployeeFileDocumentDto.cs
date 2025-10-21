using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseFileDocument.AuditCaseFileDocument.Dto
{
    public class AuditCaseFileDocumentDto
    {
        public string EntityName { get; set; } = default!;
        public string ActionType { get; set; } = default!;
        public string PerformedBy { get; set; } = default!;
        public string? PerformedByUserId { get; set; }
        public string AffectedCaseName { get; set; } = default!;
        public string? OldFileName { get; set; }= default!;
        public string? NewFileName { get; set; } = default!;
        public int? AffectedCaseId { get; set; }
        public string Details { get; set; } = default!;
        public string Remark { get; set; }
        public DateTime PerformedAt { get; set; }
    }
}
