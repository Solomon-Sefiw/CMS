using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationCommand
{
    public class RejectEmployeeReClassificationHandler:IRequestHandler<RejectEmployeeReClassification, int>
    {
        private readonly IDataService dataService;

        public RejectEmployeeReClassificationHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectEmployeeReClassification command, CancellationToken cancellationToken)
        {
            var rejected = await dataService.EmployeeReClassifications.FindAsync(command.Id);

            if (rejected == null)
                throw new Exception("ReClassifications not found.");

            rejected.TransactionStatus = Domain.Enum.EmployeeTransactionStatus.Rejected;
            rejected.Remark = rejected.Remark+"\n"+command.remark;
            await dataService.SaveAsync(cancellationToken);
            return rejected.Id;
        }

    }
}
