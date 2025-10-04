using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.JudgeAssignment.Models
{
    public class JudgeAssignmentDto
    {
        public int Id { get; set; }
        public string? JudgeId { get; set; }
        public string? JudgeName { get; set; }
        public int? CaseId { get; set; }
        public string? CaseNumber { get; set; }
        public int? ChilotId { get; set; }
        public string? ChilotName { get; set; }
        public int? BusinessUnitId { get; set; }
        public string? BusinessUnitName { get; set; }
        public DateTime AssignedAt { get; set; }
        public DateTime? UnassignedAt { get; set; }
        public string? Role { get; set; }
    }
}
