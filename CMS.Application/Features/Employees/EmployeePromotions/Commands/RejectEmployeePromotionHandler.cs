using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeePromotions.Commands
{
    public class RejectEmployeePromotionHandler:IRequestHandler<RejectEmployeePromotion, int>
    {
        private readonly IDataService dataService;

        public RejectEmployeePromotionHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(RejectEmployeePromotion command, CancellationToken cancellationToken)
        {
            var rejected = await dataService.EmployeePromotions.FindAsync(command.Id);

            if (rejected == null)
                throw new Exception("Promotion not found.");

            rejected.TransactionStatus = Domain.Enum.EmployeeTransactionStatus.Rejected;
            rejected.Remark = rejected.Remark+"\n"+command.remark;
            await dataService.SaveAsync(cancellationToken);
            return rejected.Id;
        }

    }
}
