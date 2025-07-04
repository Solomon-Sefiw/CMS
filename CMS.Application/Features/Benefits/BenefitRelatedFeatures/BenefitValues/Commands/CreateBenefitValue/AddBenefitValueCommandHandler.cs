using CMS.Domain.Benefit;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Commands.CreateBenefitValue
{
    public class AddBenefitValueCommandHandler : IRequestHandler<AddBenefitValueCommand, int>
    {
        private readonly IDataService _dataService;

        public AddBenefitValueCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<int> Handle(AddBenefitValueCommand request, CancellationToken cancellationToken)
        {
            var benefitValue = new BenefitValue
            {
                BenefitId = request.benefitId,
                Value = request.value,
                Description = request.description,

            };

            _dataService.BenefitValues.Add(benefitValue);
            await _dataService.SaveAsync(cancellationToken);

            return benefitValue.Id;
        }
    }

}
