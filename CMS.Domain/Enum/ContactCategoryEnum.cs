using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Enum
{
    public enum ContactCategoryEnum
    {
        BusinessUnitContact = 1,
        EmployeeContact = 2,
        EmergencyContact = 3,
        EmployeeSpouseContact = 6,//previous 2
        EmployeeParentContact = 7,//previous 3
        EmployeeGuaranter = 4,
        GuaranterWorkingFirmContact = 5,
    }
}
