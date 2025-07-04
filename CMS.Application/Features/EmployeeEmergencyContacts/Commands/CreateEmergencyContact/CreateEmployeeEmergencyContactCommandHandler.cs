using CMS.Application.Features.Service;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.EmployeeEmergencyContacts.Commands
{
    public class CreateEmployeeEmergencyContactCommandHandler : IRequestHandler<CreateEmployeeEmergencyContactCommand, int>
    {
        private readonly IDataService _service;
        private readonly IEmployeeChangeLogService employeeChangeLogService;

        public CreateEmployeeEmergencyContactCommandHandler(IDataService service, IEmployeeChangeLogService employeeChangeLogService)
        {
            _service = service;
            this.employeeChangeLogService = employeeChangeLogService;
        }

        public async Task<int> Handle(CreateEmployeeEmergencyContactCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var employeeEmergencyContact = new EmployeeEmergencyContact
                {
                    Name = request.Name,
                    MiddleName = request.MiddleName,
                    LastName = request.LastName,
                    IsWorking = request.IsWorking,
                    WorkingFirmName = request.WorkingFirmName,
                    EmployeeId = request.EmployeeId
                };

                _service.EmployeeEmergencyContacts.Add(employeeEmergencyContact);
                await _service.SaveAsync(cancellationToken);
                await employeeChangeLogService.LogEmergencyContactChange(employeeEmergencyContact, ChangeType.Added, cancellationToken);
                return employeeEmergencyContact.Id;
            }
            catch (Exception ex)
            {
                // Log the exception
                // Optionally rethrow or return a specific error response
                throw new ApplicationException("An error occurred while creating the employee emergency contact.", ex);
            }
        }
    }
}
