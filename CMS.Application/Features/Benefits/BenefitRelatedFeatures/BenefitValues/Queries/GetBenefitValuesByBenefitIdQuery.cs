using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Model;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Queries
{
    public record GetBenefitValuesByBenefitIdQuery(int benefitId) : IRequest<List<BenefitValueDto>>;

}
