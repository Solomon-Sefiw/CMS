using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Benefit
{
    public class BenefitValue
    {
        public int Id { get; set; }
        public int BenefitId { get; set; }
        public Benefit Benefit { get; set; }
        public decimal Value { get; set; } // e.g., 10, 20, 30
        public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;

        public string? Description { get; set; }
        public string?  Remark { get; set; }
    }

}
