using CMS.Application.Features.Employees.SalaryIncrement.SalaryIncrementCommand;
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
using static CMS.Application.Security.AuthPolicy.Employee;

namespace CMS.Application.Features.Employees.SalaryIncrement.SalaryIncrementCommand
{
    public class SubmitSalaryIncrementCommandHandler : IRequestHandler<SubmitSalaryIncrementCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitSalaryIncrementCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(SubmitSalaryIncrementCommand command, CancellationToken cancellationToken)
        {
            var submitted = await dataService.EmployeeSalaryIncrements.FindAsync(command.Id);

            if (submitted == null)
                throw new Exception("SalaryIncremnt not found.");

            submitted.TransactionStatus = Domain.Enum.EmployeeTransactionStatus.Submitted;
            submitted.Remark = submitted.Remark + "\n" + command.remark;

            await dataService.SaveAsync(cancellationToken);
            return submitted.Id;
        }

    }
}
