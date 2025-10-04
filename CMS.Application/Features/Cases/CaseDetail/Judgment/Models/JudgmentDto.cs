using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Judgment.Models
{
    public class JudgmentDto
    {
        public int Id { get; set; }
        public int CaseId { get; set; }
        public string? CaseNumber { get; set; }
        public string HtmlContent { get; set; } = string.Empty;
        public string? PdfFilePath { get; set; }
        public string? SignedByUserId { get; set; }
        public string? SignedByName { get; set; }
        public DateTime? SignedAt { get; set; }
        public string? FileHash { get; set; }
        public bool IsPublished { get; set; }
        public DateTime? PublishedAt { get; set; }
    }
}
