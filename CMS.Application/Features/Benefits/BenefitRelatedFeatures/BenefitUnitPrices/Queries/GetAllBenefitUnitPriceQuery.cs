using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Model;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Queries
{
    public record GetAllBenefitUnitPriceQuery() : IRequest<List<BenefitUnitPriceDto>>;
}
