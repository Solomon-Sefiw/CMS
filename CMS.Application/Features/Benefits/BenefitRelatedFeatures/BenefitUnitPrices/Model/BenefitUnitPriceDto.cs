using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Model
{
    public class BenefitUnitPriceDto
    {
        public int Id { get; set; }
        public int BenefitId { get; set; }
        public string? BenefitName { get; set; }
        public decimal Price { get; set; }
        public string? UnitOfMeasurementName { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
        public DateTime EffectiveDate { get; set; }
        public string? Remark { get; set; }
        public ActivationEnum ActivationEnum { get; set; }
    }
}
