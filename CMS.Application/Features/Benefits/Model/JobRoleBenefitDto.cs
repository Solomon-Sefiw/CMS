using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Model;
using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.Model
{
    public class JobRoleBenefitDto
    {
        public int Id { get; set; }
        public int BenefitId { get; set; }
        public string? BenefitName { get; set; }

        public string? UnitOfMeasurementName { get; set; }
        public bool IsUnitPriced { get; set; }

        public int BenefitValueId { get; set; }
        public decimal Value { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? CalculatedBenefitAmount => IsUnitPriced ? Value * UnitPrice : (decimal?)null;

        public ApprovalStatus ApprovalStatus { get; set; }
        public string? Description { get; set; }
        public string? Remark { get; set; }

        public BenefitUnitPriceDto? LatestUnitPrice { get; set; }
    }
}
