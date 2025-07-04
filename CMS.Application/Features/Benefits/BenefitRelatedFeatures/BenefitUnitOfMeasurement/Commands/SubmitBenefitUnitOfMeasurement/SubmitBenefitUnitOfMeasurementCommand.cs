using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Commands.RejectBenefitUnitOfMeasurement
{
    public record SubmitBenefitUnitOfMeasurementCommand(int Id, string remark) : IRequest<int>;

}
