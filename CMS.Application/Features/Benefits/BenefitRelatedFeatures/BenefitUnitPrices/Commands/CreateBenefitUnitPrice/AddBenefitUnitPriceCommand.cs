using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrice.Commands.CreateBenefitUnitPrice
{
    public record AddBenefitUnitPriceCommand(int BenefitId, decimal Price, DateTime EffectiveDate ) : IRequest<int>; 
}
