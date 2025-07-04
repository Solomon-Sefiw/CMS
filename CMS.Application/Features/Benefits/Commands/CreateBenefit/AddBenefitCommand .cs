using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.Commands.CreateBenefit
{
    public record AddBenefitCommand(
        string Name,
        int UnitOfMeasurementId
    ) : IRequest<int>;


}
