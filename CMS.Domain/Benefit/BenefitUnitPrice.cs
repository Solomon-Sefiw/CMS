using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Benefit
{
    public class BenefitUnitPrice
    {
        public int Id { get; set; }
        public int BenefitId { get; set; }         
        public decimal Price { get; set; }           // Price  (e.g., per liter)
        public DateTime EffectiveDate { get; set; }  
        public ApprovalStatus ApprovalStatus  { get; set; }=ApprovalStatus.Draft;
        public Benefit Benefit { get; set; }
        public string? Remark { get; set; }
        public ActivationEnum IsActive { get; set; } = ActivationEnum.Active;
    }
}
