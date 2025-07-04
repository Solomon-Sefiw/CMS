using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.Commands.SubmitBenefit
{
    public record SubmitBenefitCommand(int Id ,string remark):IRequest<int>;

}
