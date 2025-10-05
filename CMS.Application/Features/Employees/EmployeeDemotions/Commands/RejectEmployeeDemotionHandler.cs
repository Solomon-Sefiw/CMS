using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeDemotions.Commands
{
    public class RejectEmployeeDemotionHandler:IRequestHandler<RejectEmployeeDemotion, int>
    {
        private readonly IDataService dataService;

        public RejectEmployeeDemotionHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectEmployeeDemotion command, CancellationToken cancellationToken)
        {
            var rejected = await dataService.EmployeeDemotions.FindAsync(command.Id);

            if (rejected == null)
                throw new Exception("Demotion not found.");

            rejected.TransactionStatus = Domain.Enum.EmployeeTransactionStatus.Rejected;
            rejected.Remark = rejected.Remark+"\n"+command.remark;
            await dataService.SaveAsync(cancellationToken);
            return rejected.Id;
        }

    }
}
