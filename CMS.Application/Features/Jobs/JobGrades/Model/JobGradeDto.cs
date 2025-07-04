using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using CMS.Domain;
using CMS.Domain.Enum;

namespace CMS.Application.Features.Jobs.JobGrades.Model
{
    public class JobGradeDto
    {
        public int JobGradeId {  get; set; }
        public JobGradeRomanId JobGradeRomanId { get; set; } // Changed to string
        public string Name { get; set; }
        public decimal BaseSalary { get; set; }
        public decimal StepCoefficient { get; set; }
        public decimal? CeilingSalary { get; set; }
        public string Description { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }

        public List<JobGradeStepDto> JobGradeSteps { get; set; }
    }

    public class JobGradeStepDto
    {
        public int StepNumber { get; set; }
        public decimal SalaryAmount { get; set; }
    }

}
