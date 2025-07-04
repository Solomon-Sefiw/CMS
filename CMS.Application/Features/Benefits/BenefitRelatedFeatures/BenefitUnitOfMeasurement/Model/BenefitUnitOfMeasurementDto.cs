using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Model
{
    public class BenefitUnitOfMeasurementDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }

        public bool IsUnitPriced { get; set; }
        public string? Remark { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }

    }
}
