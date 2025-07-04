using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BranchGrades.Model
{
    public class BranchGradeDto
    {
        public int Id { get; set; }
        public string Grade { get; set; }
        public int StaffLimit { get; set; }
        public string Description { get; set; }
        public string? Remark { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
    }
}
