using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.Commands.ApproveBenefit
{
    public class ApproveBenefitCommandHandler : IRequestHandler<ApproveBenefitCommand, int>
    {
        private readonly IDataService _dataService;
        public ApproveBenefitCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<int> Handle(ApproveBenefitCommand request, CancellationToken cancellationToken)
        {
            var benefit= _dataService.Benefits.Where(b=>b.Id==request.Id).FirstOrDefault();
            if (benefit != null)
            {

             benefit.ApprovalStatus=ApprovalStatus.Approved;
             benefit.Remark=request.remark;           
                       
            }
            await _dataService.SaveAsync(cancellationToken);
            return benefit.Id;
        }
    }
}
