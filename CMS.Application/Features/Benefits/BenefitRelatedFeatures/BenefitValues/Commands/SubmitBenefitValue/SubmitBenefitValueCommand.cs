using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Commands.SubmitBenefitValue
{
    public record SubmitBenefitValueCommand(int Id, string remark) : IRequest<int>;

}
