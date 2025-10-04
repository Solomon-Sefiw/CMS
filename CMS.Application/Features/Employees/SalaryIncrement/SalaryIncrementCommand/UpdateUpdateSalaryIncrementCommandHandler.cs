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

namespace CMS.Application.Features.Employees.SalaryIncrement.SalaryIncrementCommand
{
    public class UpdateUpdateSalaryIncrementCommandHandler : IRequestHandler<UpdateSalaryIncrementCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IMapper mappper;
        public UpdateUpdateSalaryIncrementCommandHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mappper = mapper;
        }
        public async Task<int> Handle(UpdateSalaryIncrementCommand command, CancellationToken cancellationToken)
        {
            var oldSalaryIncrement = await dataService.EmployeeSalaryIncrements
                .FirstOrDefaultAsync(e => e.Id == command.Id && e.EmployeeId == command.EmployeeId);

            if (oldSalaryIncrement == null)
            {
                throw new Exception("SalaryIncrement not found.");
            }
            oldSalaryIncrement.EmployeeId = command.EmployeeId;
            oldSalaryIncrement.JobRoleId = command.JobRoleId;
            oldSalaryIncrement.SalaryIncrementDate = (DateOnly)command.SalaryIncrementDate;
            oldSalaryIncrement.SalaryIncrementEndDate = command.SalaryIncrementEndDate;
            oldSalaryIncrement.BeforeGradeSalaryStepId = command.BeforeGradeSalaryStepId;
            oldSalaryIncrement.AfterGradeSalaryStepId = command.AfterGradeSalaryStepId;
            oldSalaryIncrement.Remark = command.Remark;
            oldSalaryIncrement.TransactionStatus = EmployeeTransactionStatus.Draft;

            dataService.EmployeeSalaryIncrements.Update(oldSalaryIncrement);
            await dataService.SaveAsync(cancellationToken);
            return oldSalaryIncrement.Id;
        }

    }
}
