using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using static CMS.Application.Security.AuthPolicy.Employee;

namespace CMS.Application.Features.Employees.EmployeePromotions.Commands
{
    public class SubmitEmployeePromotionHandler : IRequestHandler<SubmitEmployeePromotion, int>
    {
        private readonly IDataService dataService;

        public SubmitEmployeePromotionHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(SubmitEmployeePromotion command, CancellationToken cancellationToken)
        {
            var submitted = await dataService.EmployeePromotions.FindAsync(command.Id);

            if (submitted == null)
                throw new Exception("Promotion not found.");

            submitted.TransactionStatus = Domain.Enum.EmployeeTransactionStatus.Submitted;
            submitted.Remark = submitted.Remark + "\n" + command.remark;

            var jobRole = await dataService.JobRoles
                .Include(j => j.JobGrade)
                    .ThenInclude(g => g.Steps)
                .FirstOrDefaultAsync(j => j.Id == submitted.JobRoleAfterId, cancellationToken);
            await dataService.SaveAsync(cancellationToken);
            return submitted.Id;
        }

    }
}
