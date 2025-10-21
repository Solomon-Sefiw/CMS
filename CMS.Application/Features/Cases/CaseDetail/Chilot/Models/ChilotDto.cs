using CMS.Domain.Assignment;
using CMS.Domain.Cases;
using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Chilot.Models
{
    public class ChilotDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ChilotType ChilotType { get; set; }
        public string? RoomNumber { get; set; }
        public int BusinessUnitId { get; set; }
        public string BusinessUnit { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
    }
}
