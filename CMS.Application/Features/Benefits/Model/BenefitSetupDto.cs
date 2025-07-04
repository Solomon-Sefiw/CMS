using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.Model
{
    public class BenefitSetupDto
    {
        public int BenefitId { get; set; }
        public string BenefitName { get; set; }
        public string Unit { get; set; }
        public List<BenefitValueDto> Values { get; set; }
    }
}
