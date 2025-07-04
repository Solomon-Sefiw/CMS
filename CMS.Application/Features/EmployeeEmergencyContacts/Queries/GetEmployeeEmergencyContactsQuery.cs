using CMS.Application.Features.EmployeeEmergencyContacts.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.EmployeeEmergencyContacts.Queries
{
    public class GetEmployeeEmergencyContactsQuery : IRequest<List<EmployeeEmergencyContactDto>>
    {
        public int EmployeeId { get; set; }
    }
}
