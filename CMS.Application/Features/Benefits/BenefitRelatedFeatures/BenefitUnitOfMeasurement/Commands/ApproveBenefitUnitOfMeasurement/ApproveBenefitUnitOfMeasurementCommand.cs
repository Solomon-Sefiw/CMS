using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Commands.ApproveBenefitUnitOfMeasurement
{
    public record ApproveBenefitUnitOfMeasurementCommand(int Id, string remark) : IRequest<int>;

}
