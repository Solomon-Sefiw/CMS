using AutoMapper;
using CMS.Domain;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using static CMS.Application.Security.UserPermissions.Employee;

namespace CMS.Application.Features.Employees.EmployeePromotions.Commands
{
    public class UpdateEmployeePromotionCommandHandler : IRequestHandler<UpdateEmployeePromotionCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IMapper mappper;
        public UpdateEmployeePromotionCommandHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mappper = mapper;
        }
        public async Task<int> Handle(UpdateEmployeePromotionCommand command, CancellationToken cancellationToken)
        {
            var oldPromotion = await dataService.EmployeePromotions
                 .Include(j => j.JobRoleAfter)                    // Include the JobRoleAfter navigation property
                  .ThenInclude(g => g.JobGrade)                // Then include the JobGrade navigation property of JobRoleAfter
                 .ThenInclude(g => g.Steps)
                 .Include(j => j.JobRoleBefore)                    // Include the JobRoleAfter navigation property
                  .ThenInclude(g => g.JobGrade)                // Then include the JobGrade navigation property of JobRoleAfter
                 .ThenInclude(g => g.Steps) // Then include the Steps navigation property of JobGrade
                .FirstOrDefaultAsync(e => e.Id == command.Id);

            if (oldPromotion == null)
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

            // Update existing promotion
            oldPromotion.EmployeeId = command.EmployeeId;
            oldPromotion.PromotionDate = command.PromotionDate;
            oldPromotion.PromotionEndDate = command.PromotionEndDate;
            oldPromotion.JobRoleBeforeId = (int)command.JobRoleBeforeId;
            oldPromotion.JobRoleAfterId = (int)command.JobRoleAfterId;
            oldPromotion.PromotionType = (PromotionType)command.PromotionType;
            oldPromotion.BusinessUnitBeforeId = (int)command.BusinessUnitBeforeId;
            oldPromotion.BusinessUnitAfterId = (int)command.BusinessUnitAfterId;
            oldPromotion.Remark = command.Remark;
            oldPromotion.TransactionStatus=EmployeeTransactionStatus.Draft;
            oldPromotion.AfterGradeSalaryStepId = command.AfterGradeSalaryStepId;
            oldPromotion.BeforeGradeSalaryStepId = command.BeforeGradeSalaryStepId;
            oldPromotion.TransactionStatus = EmployeeTransactionStatus.Draft;
      
            dataService.EmployeePromotions.Update(oldPromotion);
            await dataService.SaveAsync(cancellationToken);
            return oldPromotion.Id;
        }

    }
}
