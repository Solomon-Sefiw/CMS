using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitPrices.Commands.UpdateBenefitUnitPrice
{
    public class UpdateBenefitUnitPriceCommandHandler : IRequestHandler<UpdateBenefitUnitPriceCommand, int>
    {
        private readonly IDataService _dataService;

        public UpdateBenefitUnitPriceCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<int> Handle(UpdateBenefitUnitPriceCommand request, CancellationToken cancellationToken)
        {
            var unitPrice = await _dataService.BenefitUnitPrices.Where(p => p.Id == request.Id).FirstOrDefaultAsync();

            if (unitPrice != null)
            {

                unitPrice.BenefitId = request.BenefitId;
                unitPrice.Price = request.Price;
                unitPrice.EffectiveDate = request.EffectiveDate;
                unitPrice.ApprovalStatus=ApprovalStatus.Draft;
            }
            _dataService.BenefitUnitPrices.Update(unitPrice);
            await _dataService.SaveAsync(cancellationToken);

            return request.Id;
        }
    }
}
