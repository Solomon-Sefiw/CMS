using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Commands.RejectBenefitUnitPrice
{
    public record RejectBenefitUnitPriceCommand(int Id, string remark) : IRequest<int>;
}
