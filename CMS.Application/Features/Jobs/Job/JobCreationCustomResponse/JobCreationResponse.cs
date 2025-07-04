using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.JobCreationCustomResponse
{
    public class JobCreationResponse
    {
        public int JobId { get; set; }
        public bool JobCountExceeded { get; set; }
    }
}
