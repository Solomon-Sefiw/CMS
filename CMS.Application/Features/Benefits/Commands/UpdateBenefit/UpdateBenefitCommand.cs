using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.Commands.UpdateBenefit
{
    public record UpdateBenefitCommand(
        int Id,
        string Name,
        int UnitOfMeasurementId
        )
        :IRequest<int>;

}
