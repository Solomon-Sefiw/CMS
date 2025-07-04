using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Command.ActivateJob
{
    public record ActivateJobCommand(int Id) :IRequest<int>;

}
