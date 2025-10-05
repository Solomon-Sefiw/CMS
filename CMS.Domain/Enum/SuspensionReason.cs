using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Enum
{
    public enum SuspensionReason
    {
        Investigation = 1,
        PolicyViolation = 2,
        Misconduct = 3,
        PerformanceIssues = 4,
        Other = 99
    }
}
