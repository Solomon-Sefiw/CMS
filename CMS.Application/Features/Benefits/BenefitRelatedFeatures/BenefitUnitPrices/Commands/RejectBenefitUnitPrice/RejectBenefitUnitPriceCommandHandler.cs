using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Commands.RejectBenefitUnitPrice
{
    public class RejectBenefitUnitPriceCommandHandler : IRequestHandler<RejectBenefitUnitPriceCommand, int>
    {
        private readonly IDataService _dataService;
        public RejectBenefitUnitPriceCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<int> Handle(RejectBenefitUnitPriceCommand request, CancellationToken cancellationToken)
        {
            var unitPrice = _dataService.BenefitUnitPrices.Where(b => b.Id == request.Id).FirstOrDefault();
            if (unitPrice != null)
            {

                unitPrice.ApprovalStatus = ApprovalStatus.Rejected;
                unitPrice.Remark = request.remark;

            }
            await _dataService.SaveAsync(cancellationToken);
            return unitPrice.Id;
        }
    }
}
