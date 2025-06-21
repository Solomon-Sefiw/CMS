using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Enum
{
    public enum EmployeeChangeLogEntityType
    {
        BasicInfo = 1,
        Family = 2,
        Address = 3,
        Contact = 4,
        EmergencyContact = 5,
        Block = 6,
        Unblock = 7,
        Language = 8,
        Education = 9,
        Experiance = 10,
        Guarantee = 11,
    }

    public enum ChangeType
    {
        Added = 1,
        Modified = 2,
        Deleted = 3,
        Blocked = 4,
        Unblocked = 5,
        Deactivated = 6,
    }
}
