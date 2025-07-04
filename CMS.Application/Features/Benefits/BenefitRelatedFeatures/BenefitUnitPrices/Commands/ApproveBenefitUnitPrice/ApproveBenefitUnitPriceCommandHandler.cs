using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Commands.ApproveBenefitUnitPrice
{
    public class ApproveBenefitUnitPriceCommandHandler : IRequestHandler<ApproveBenefitUnitPriceCommand, int>
    {
        private readonly IDataService _dataService;
        public ApproveBenefitUnitPriceCommandHandler(IDataService dataService)
        {
            _dataService= dataService;
        }
        public async Task<int> Handle(ApproveBenefitUnitPriceCommand request, CancellationToken cancellationToken)
        {
            var unitPrice = _dataService.BenefitUnitPrices
                .FirstOrDefault(b => b.Id == request.Id);

            if (unitPrice != null)
            {
                unitPrice.ApprovalStatus = ApprovalStatus.Approved;
                unitPrice.Remark = request.remark;
            }
            var existingUnitPrices = _dataService.BenefitUnitPrices
                .Where(p => p.BenefitId == unitPrice.BenefitId &&
                            p.Id != unitPrice.Id &&
                            p.IsActive == ActivationEnum.Active)
                .ToList();

            foreach (var price in existingUnitPrices)
            {
                price.IsActive = ActivationEnum.InActive;
            }

            await _dataService.SaveAsync(cancellationToken);
            return unitPrice.Id;
        }

    }
}
