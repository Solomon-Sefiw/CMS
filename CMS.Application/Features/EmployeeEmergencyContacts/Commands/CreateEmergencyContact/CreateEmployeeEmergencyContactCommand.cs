using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.EmployeeEmergencyContacts.Commands
{
    public class CreateEmployeeEmergencyContactCommand:IRequest<int>
    {
        public string Name { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public bool IsWorking { get; set; }
        public string WorkingFirmName { get; set; }
        public int EmployeeId { get; set; }
    }

}
