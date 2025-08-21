using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Enum
{
    public enum DemotionType
    {
        PoorPerformance = 1,
        DisciplinaryAction = 2,
        Restructuring = 3,
        VoluntaryRequest = 4,
        LackofRequiredSkills = 5,
        Other=6
    }
}
