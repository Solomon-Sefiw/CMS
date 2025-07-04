using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Jobs
{
    public class JobGradeStepsValue
    {
        public int Id { get; set; }
        public int StepEnd { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string Description { get; set; }
    }
}
