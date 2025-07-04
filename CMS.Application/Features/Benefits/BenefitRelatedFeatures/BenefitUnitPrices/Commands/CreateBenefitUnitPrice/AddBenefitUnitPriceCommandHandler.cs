using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrice.Commands.CreateBenefitUnitPrice;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Commands.CreateBenefitUnitPrice
{
    public class AddBenefitUnitPriceCommandHandler : IRequestHandler<AddBenefitUnitPriceCommand, int>
    {
        private readonly IDataService _dataService;

        public AddBenefitUnitPriceCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<int> Handle(AddBenefitUnitPriceCommand request, CancellationToken cancellationToken)
        {
            var newPrice = new CMS.Domain.Benefit.BenefitUnitPrice
            {
                BenefitId = request.BenefitId,
                Price = request.Price,
                EffectiveDate = request.EffectiveDate,
                ApprovalStatus = ApprovalStatus.Draft,
                IsActive = ActivationEnum.Active
            };

            _dataService.BenefitUnitPrices.Add(newPrice);
            await _dataService.SaveAsync(cancellationToken);

            return newPrice.Id;
        }

    }
}
