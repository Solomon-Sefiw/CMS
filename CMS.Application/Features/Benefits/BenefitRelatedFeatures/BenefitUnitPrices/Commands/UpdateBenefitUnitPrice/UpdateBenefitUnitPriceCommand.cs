using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Commands.UpdateBenefitUnitPrice
{
    public record UpdateBenefitUnitPriceCommand(int Id,int BenefitId,decimal Price, DateTime EffectiveDate) : IRequest<int>; 
}
