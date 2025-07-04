using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Commands.CreateBenefitUnitOfMeasurement
{
    public record AddBenefitUnitOfMeasurementCommand(string Name, bool isUnitPriced, string? Description) : IRequest<int>;

}
