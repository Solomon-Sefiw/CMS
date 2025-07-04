using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Domain.Language;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Service
{
    public class EmpoloyeeChangeLogService : IEmployeeChangeLogService
    {
        private readonly IDataService dataService;

        public EmpoloyeeChangeLogService(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task LogChange(int employeeId, int entityId, EmployeeChangeLogEntityType entityType, ChangeType changeType, CancellationToken cancellationToken = default)
        {

            var changeLog = await dataService.EmployeeChangeLogs.AnyAsync(c => c.EmployeeID == employeeId
                                                                                           && c.EntityId == entityId
                                                                                           && c.EntityType == entityType);

            if (!changeLog)
            {
                dataService.EmployeeChangeLogs.Add(new EmployeeChangeLog
                {
                    ChangeType = changeType,
                    EntityType = entityType,
                    EntityId = entityId,
                    EmployeeID = employeeId,
                });

                await dataService.SaveAsync(cancellationToken);
            }
        }
        public async Task LogEmployeeBasicInfoChange(Employee employee, ChangeType changeType, CancellationToken cancellationToken = default)
        {
            await LogChange(employee.Id, employee.Id, EmployeeChangeLogEntityType.BasicInfo, changeType, cancellationToken);
        }

        public async Task LogEmployeeLanguageChange(LanguageSkill employee, ChangeType changeType, CancellationToken cancellationToken = default)
        {
            await LogChange(employee.EmployeeId, employee.Id, EmployeeChangeLogEntityType.Language, changeType, cancellationToken);
        }

        public async Task LogEmployeeFamilyChange(EmployeeFamily family, ChangeType changeType, CancellationToken cancellationToken = default)
        {
            await LogChange(family.EmployeeId, family.Id, EmployeeChangeLogEntityType.Family, changeType, cancellationToken);
        }
        public async Task LogEmergencyContactChange(EmployeeEmergencyContact emergencyContact, ChangeType changeType, CancellationToken cancellationToken = default)
        {
            await LogChange(emergencyContact.EmployeeId, emergencyContact.Id, EmployeeChangeLogEntityType.EmergencyContact, changeType, cancellationToken);
        }

        public async Task Clear(int employeeId, CancellationToken cancellationToken = default)
        {
            var changeLogs = await dataService.EmployeeChangeLogs.Where(c => c.EmployeeID == employeeId).ToListAsync();
            dataService.EmployeeChangeLogs.RemoveRange(changeLogs);

            await dataService.SaveAsync(cancellationToken);
        }
    }
}