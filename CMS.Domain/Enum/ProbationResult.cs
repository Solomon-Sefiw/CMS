using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Enum
{
    public enum ProbationResult
    {
        BecomePermanent = 1,
        PoorPerformance = 2,
        PolicyViolation = 3,
        AttendanceIssues = 4,
        BehavioralIssues = 5,
        NotaCulturalFit = 6,
        Other = 7,
        ReturnedFromApproval = 8,
        ActivateRejectedProbation = 9,

    }
}
