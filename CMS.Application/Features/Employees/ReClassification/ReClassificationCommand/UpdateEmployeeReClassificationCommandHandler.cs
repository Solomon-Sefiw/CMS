using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CMS.Domain;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using static CMS.Application.Security.UserPermissions.Employee;

namespace CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationCommand
{
    public class UpdateEmployeeReClassificationCommandHandler : IRequestHandler<UpdateEmployeeReClassificationCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IMapper mappper;
        public UpdateEmployeeReClassificationCommandHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mappper = mapper;
        }
        public async Task<int> Handle(UpdateEmployeeReClassificationCommand command, CancellationToken cancellationToken)
        {
            var oldReClassification = await dataService.EmployeeReClassifications
                 .Include(j => j.JobRoleAfter)                    // Include the JobRoleAfter navigation property
                  .ThenInclude(g => g.JobGrade)                // Then include the JobGrade navigation property of JobRoleAfter
                 .ThenInclude(g => g.Steps)
                 .Include(j => j.JobRoleBefore)                    // Include the JobRoleAfter navigation property
                  .ThenInclude(g => g.JobGrade)                // Then include the JobGrade navigation property of JobRoleAfter
                 .ThenInclude(g => g.Steps) // Then include the Steps navigation property of JobGrade
                .FirstOrDefaultAsync(e => e.Id == command.Id);

            if (oldReClassification == null)
            {
                throw new Exception("ReClassification not found.");
            }
            var jobRoleafter = await dataService.JobRoles
              .Include(j => j.JobGrade)
              .ThenInclude(g => g.Steps)
              .FirstOrDefaultAsync(j => j.Id == command.JobRoleAfterId, cancellationToken);
            //
            var jobRoleBefore = await dataService.JobRoles
               .Include(j => j.JobGrade)
               .ThenInclude(g => g.Steps)
               .FirstOrDefaultAsync(j => j.Id == command.JobRoleBeforeId, cancellationToken);

            if (jobRoleBefore == null)
                throw new Exception("Job role not found.");

            // Update existing ReClassification
            oldReClassification.EmployeeId = command.EmployeeId;
            oldReClassification.ReClassificationDate = command.ReClassificationDate;
            oldReClassification.ReClassificationEndDate = command.ReClassificationEndDate;
            oldReClassification.JobRoleBeforeId = (int)command.JobRoleBeforeId;
            oldReClassification.JobRoleAfterId = (int)command.JobRoleAfterId;
            oldReClassification.ReClassificationType = (ReClassificationType)command.ReClassificationType;
        
            oldReClassification.Remark = command.Remark;
            oldReClassification.TransactionStatus=EmployeeTransactionStatus.Draft;
         /*   oldReClassification.AfterGradeSalaryStepId = command.AfterGradeSalaryStepId;
            oldReClassification.BeforeGradeSalaryStepId = command.BeforeGradeSalaryStepId;
            oldReClassification.IsBusinessUnitChange = command.IsBusinessUnitChange;
            oldReClassification.BusinessUnitBeforeId = (int)command.BusinessUnitBeforeId;
            oldReClassification.BusinessUnitAfterId = (int)command.BusinessUnitAfterId;**/

            dataService.EmployeeReClassifications.Update(oldReClassification);
            await dataService.SaveAsync(cancellationToken);
            return oldReClassification.Id;
        }

    }
}
