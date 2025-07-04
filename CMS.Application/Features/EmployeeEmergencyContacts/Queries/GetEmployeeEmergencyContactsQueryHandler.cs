using CMS.Application.Features.EmployeeEmergencyContacts.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.EmployeeEmergencyContacts.Queries
{
    public class GetEmployeeEmergencyContactsQueryHandler : IRequestHandler<GetEmployeeEmergencyContactsQuery, List<EmployeeEmergencyContactDto>>
    {
        private readonly IDataService _service;

        public GetEmployeeEmergencyContactsQueryHandler(IDataService service)
        {
            _service = service;
        }

        public async Task<List<EmployeeEmergencyContactDto>> Handle(GetEmployeeEmergencyContactsQuery request, CancellationToken cancellationToken)
        {
            var contacts = await _service.EmployeeEmergencyContacts
                .Where(contact => contact.EmployeeId == request.EmployeeId)
                .Select(contact => new EmployeeEmergencyContactDto
                {  Id=contact.Id,
                    Name = contact.Name,
                    MiddleName = contact.MiddleName,
                    LastName = contact.LastName,
                    IsWorking = contact.IsWorking,
                    WorkingFirmName = contact.WorkingFirmName
                })
                .ToListAsync(cancellationToken);

            return contacts;
        }
    }
}
