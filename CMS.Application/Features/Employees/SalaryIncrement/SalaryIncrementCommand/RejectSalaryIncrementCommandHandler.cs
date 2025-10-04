using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.SalaryIncrement.SalaryIncrementCommand
{
    public class RejectSalaryIncrementCommandHandler : IRequestHandler<RejectSalaryIncrementCommand, int>
    {
        private readonly IDataService dataService;

        public RejectSalaryIncrementCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectSalaryIncrementCommand command, CancellationToken cancellationToken)
        {
            var rejected = await dataService.EmployeeSalaryIncrements.FindAsync(command.Id);

            if (rejected == null)
                throw new Exception("SalaryIncremnt not found.");

            rejected.TransactionStatus = Domain.Enum.EmployeeTransactionStatus.Rejected;
            rejected.Remark = rejected.Remark + "\n" + command.remark;
            await dataService.SaveAsync(cancellationToken);
            return rejected.Id;
        }

    }
}
