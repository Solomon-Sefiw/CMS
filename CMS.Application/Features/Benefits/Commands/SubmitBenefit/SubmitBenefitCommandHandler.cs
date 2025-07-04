using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.Commands.SubmitBenefit
{
    public class SubmitBenefitCommandHandler : IRequestHandler<SubmitBenefitCommand, int>
    {
        private readonly IDataService _dataService;
        public SubmitBenefitCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<int> Handle(SubmitBenefitCommand request, CancellationToken cancellationToken)
        {
            var benefit = _dataService.Benefits.Where(b => b.Id == request.Id).FirstOrDefault();
            if (benefit != null)
            {

                benefit.ApprovalStatus = ApprovalStatus.Submitted;
                benefit.Remark = request.remark;

            }
            await _dataService.SaveAsync(cancellationToken);
            return benefit.Id;
        }
    }
}
