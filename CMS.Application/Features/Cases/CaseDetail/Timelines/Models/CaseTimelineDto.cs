using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Timelines.Models
{
    public class CaseTimelineDto
    {
        public int Id { get; set; }
        public int CaseId { get; set; }
        public string? CaseNumber { get; set; }
        public string EventType { get; set; } = string.Empty;
        public string? Details { get; set; }
        public string? ActorUserId { get; set; }
        public string? ActorUserName { get; set; }
        public DateTime EventAt { get; set; }
        public DateTime CreatedAt { get; set; }    // from AuditableEntity
        public DateTime? ModifiedAt { get; set; }  // from AuditableEntity
    }
}
