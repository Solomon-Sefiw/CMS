using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Commands.UpdateBenefitUnitOfMeasurement
{
    public record UpdateBenefitUnitOfMeasurementCommand(int Id, string Name, bool isUnitPriced, string? Description) : IRequest<int>;

}
