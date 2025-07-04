using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Model
{
    public class BenefitValueDto
    {
        public int Id { get; set; }

        public int BenefitId { get; set; }

        public string BenefitName { get; set; } = string.Empty;

        public decimal Value { get; set; }              // Quantity
        public decimal? UnitPrice { get; set; }         // Latest price per unit
        public decimal? CalculatedBenefitAmount { get; set; }       // Calculated

        public ApprovalStatus ApprovalStatus { get; set; }
        public bool IsUnitPriced { get; set; }
        public string UnitOfMeasurementName { get; set; }

        public string? Description { get; set; }

        public string? Remark { get; set; }
    }

}
