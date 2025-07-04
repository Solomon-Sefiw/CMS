
using CMS.Application.Features.Jobs.Job.JobUpdationCustomResponse;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Command.UpdateJob
{
    public record UpdateJobCommand(int jobId,int jobRoleId, int businessunitId):IRequest<JobUpdationResponse>;

}
