using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Benefit
{
    public class BenefitUnitOfMeasurement
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public bool IsUnitPriced { get; set; }
        public string? Description { get; set; } = string.Empty;

        public string? Remark { get; set; }

        public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;
        public ICollection<Benefit> Benefits { get; set; }
    }
}
