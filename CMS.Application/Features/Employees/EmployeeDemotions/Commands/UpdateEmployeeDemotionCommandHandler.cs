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

namespace CMS.Application.Features.Employees.EmployeeDemotions.Commands
{
    public class UpdateEmployeeDemotionCommandHandler : IRequestHandler<UpdateEmployeeDemotionCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IMapper mappper;
        public UpdateEmployeeDemotionCommandHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mappper = mapper;
        }
        public async Task<int> Handle(UpdateEmployeeDemotionCommand command, CancellationToken cancellationToken)
        {
            var oldDemotions = await dataService.EmployeeDemotions
                 .Include(j => j.JobRoleAfter)                    // Include the JobRoleAfter navigation property
                  .ThenInclude(g => g.JobGrade)                // Then include the JobGrade navigation property of JobRoleAfter
                 .ThenInclude(g => g.Steps)
                 .Include(j => j.JobRoleBefore)                    // Include the JobRoleAfter navigation property
                  .ThenInclude(g => g.JobGrade)                // Then include the JobGrade navigation property of JobRoleAfter
                 .ThenInclude(g => g.Steps) // Then include the Steps navigation property of JobGrade
                .FirstOrDefaultAsync(e => e.Id == command.Id);

            if (oldDemotions == null)
            {
                throw new Exception("Promotion not found.");
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

            var experienceUpdated = await dataService.EmployeeExperiences
   .FirstOrDefaultAsync(ex =>
       ex.JobTitle == oldDemotions.JobRoleAfter.RoleName &&
       ex.StartDate == oldDemotions.DemotionDate &&
       ex.EndDate == oldDemotions.DemotionEndDate &&
       ex.EmployeeId == command.EmployeeId &&
       ex.ReasonForResignation == "" &&
       ex.FirmName == "Amhara Court",
       cancellationToken);
            //
            // Update existing promotion
            oldDemotions.EmployeeId = command.EmployeeId;
            oldDemotions.DemotionDate = command.DemotionDate;
            oldDemotions.DemotionEndDate = command.DemotionEndDate;
            oldDemotions.JobRoleBeforeId = (int)command.JobRoleBeforeId;
            oldDemotions.JobRoleAfterId = (int)command.JobRoleAfterId;
            oldDemotions.DemotionType = (DemotionType)command.DemotionType;
            oldDemotions.BusinessUnitBeforeId = (int)command.BusinessUnitBeforeId;
            oldDemotions.BusinessUnitAfterId = (int)command.BusinessUnitAfterId;
            oldDemotions.IsBusinessUnitChange = command.IsBusinessUnitChange;
            oldDemotions.BeforeGradeSalaryStepId = command.BeforeGradeSalaryStepId;
            oldDemotions.AfterGradeSalaryStepId = command.AfterGradeSalaryStepId;
            oldDemotions.Remark = command.Remark;
            oldDemotions.TransactionStatus = EmployeeTransactionStatus.Draft;    
            dataService.EmployeeDemotions.Update(oldDemotions);
            await dataService.SaveAsync(cancellationToken);
            return oldDemotions.Id;
        }

    }
}
