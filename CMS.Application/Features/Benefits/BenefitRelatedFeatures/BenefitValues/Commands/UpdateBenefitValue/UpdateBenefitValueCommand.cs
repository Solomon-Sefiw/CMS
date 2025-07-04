using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Commands.UpdateBenefitValue
{
    public record UpdateBenefitValueCommand(int Id, int benefitId, decimal value, string? description) : IRequest<int>;




}
