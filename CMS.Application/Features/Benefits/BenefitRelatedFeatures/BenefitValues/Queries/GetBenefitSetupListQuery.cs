using CMS.Application.Features.Benefits.Model;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Queries
{
    public record GetBenefitSetupListQuery : IRequest<List<BenefitSetupDto>>;
}
