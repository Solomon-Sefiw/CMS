using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.JobUpdationCustomResponse
{
    public class JobUpdationResponse
    {
        public int JobId { get; set; }
        public bool IsLocked { get; set; }
    }
}
