using CMS.Application.Exceptions;
using CMS.Application.Features.Service;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.EmployeeEmergencyContacts.Commands.UpdateEmeregencyContact
{
    public class UpdateEmployeeEmergencyContactCommandHandler : IRequestHandler<UpdateEmployeeEmergencyContactCommand,int>
    {
        private readonly IDataService _service ;
        private readonly IEmployeeChangeLogService employeeChangeLogService;

        public UpdateEmployeeEmergencyContactCommandHandler(IDataService service, IEmployeeChangeLogService employeeChangeLogService)
        {
            _service = service;
            this.employeeChangeLogService = employeeChangeLogService;
        }

        public async Task<int> Handle(UpdateEmployeeEmergencyContactCommand request, CancellationToken cancellationToken)
        {
            var employeeEmergencyContact = await _service.EmployeeEmergencyContacts
                .FirstOrDefaultAsync(ec => ec.Id == request.Id, cancellationToken);

            if (employeeEmergencyContact == null)
            {
                throw new NotFoundException("EmployeeEmergencyContact not found.");
            }

            employeeEmergencyContact.Name = request.Name;
            employeeEmergencyContact.MiddleName = request.MiddleName;
            employeeEmergencyContact.LastName = request.LastName;
            employeeEmergencyContact.IsWorking = request.IsWorking;
            employeeEmergencyContact.WorkingFirmName = request.WorkingFirmName;
            employeeEmergencyContact.EmployeeId = request.EmployeeId;
            await _service.SaveAsync(cancellationToken);
            await employeeChangeLogService.LogEmergencyContactChange(employeeEmergencyContact, ChangeType.Modified, cancellationToken);
            return employeeEmergencyContact.Id; 
        }
    }

}
