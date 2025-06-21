using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Enum
{
    public enum EmployeeIDCardStatus
    {
          IDCardApprovalRequest=1,
          IDCardApprovalRejected=2,
          IDGiven = 3,
          IDReplacedAndGiven = 4,
          IDNotGiven = 5,
          IDCardOnRegenerated = 6,
          IDCardApproved=7,
    }
}
