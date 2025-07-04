using CMS.Application.Features.Jobs;
using CMS.Application.Features.Jobs.Job.Model;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Query
{
    public class GetAllJobQuery:IRequest<List<JobDto>>
    {
    }
}
