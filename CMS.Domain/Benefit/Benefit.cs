using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Benefit
{
    public class Benefit
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int UnitOfMeasurementId { get; set; }
        public BenefitUnitOfMeasurement UnitOfMeasurement { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;
        public ActivationEnum IsActive { get; set; } = ActivationEnum.Active;
        public string? Remark { get; set; }

        public ICollection<BenefitValue> BenefitValues { get; set; }
        public ICollection<JobRoleBenefit> JobRoleBenefits { get; set; }
        public ICollection<BenefitUnitPrice> BenefitUnitPrices { get; set; }

    }
}
