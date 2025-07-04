using CMS.Domain.Benefit;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.Commands.CreateBenefit
{

    public class AddBenefitCommandHandler : IRequestHandler<AddBenefitCommand, int>
    {
        private readonly IDataService _dataService;

        public AddBenefitCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<int> Handle(AddBenefitCommand request, CancellationToken cancellationToken)
        {
            var benefit = new Benefit
            {
                Name = request.Name,
                UnitOfMeasurementId = request.UnitOfMeasurementId,
                ApprovalStatus = ApprovalStatus.Draft,
                IsActive = ActivationEnum.Active
            };
            _dataService.Benefits.Add(benefit);
            await _dataService.SaveAsync(cancellationToken);

            return benefit.Id;
        }
    }

}
