using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Archives.Models
{
    public class DocketEntryDto
    {
        public int Id { get; set; }
        public string DocketNumber { get; set; } = string.Empty;
        public int CaseId { get; set; }
        public string? StoragePath { get; set; }
        public DateTime ArchivedAt { get; set; }
        public string? ArchivedBy { get; set; }
        public DateTime CreatedAt { get; set; }   // from AuditableEntity
        public DateTime? ModifiedAt { get; set; } // from AuditableEntity
    }
}
