
using CMS.Application.Features.Jobs.Job.JobCreationCustomResponse;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Command.CreateJob
{
    public record AddJobCommand(int jobRoleId, int businessunitId,int requiredNumber) : IRequest<JobCreationResponse>;
}
