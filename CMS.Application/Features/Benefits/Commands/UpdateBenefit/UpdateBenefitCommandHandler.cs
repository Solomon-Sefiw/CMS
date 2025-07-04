using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.Commands.UpdateBenefit
{
    public class UpdateBenefitCommandHandler : IRequestHandler<UpdateBenefitCommand, int>
    {
        private readonly IDataService _dataService;
        public UpdateBenefitCommandHandler(IDataService dataService)
        {
            _dataService= dataService;
        }
        public async Task<int> Handle(UpdateBenefitCommand request, CancellationToken cancellationToken)
        {
            var existingBenefit = await _dataService.Benefits.FindAsync(request.Id);
            if (existingBenefit == null)
                throw new KeyNotFoundException($"Benefit with Id {request.Id} not found.");

            existingBenefit.Name = request.Name;
            existingBenefit.UnitOfMeasurementId = request.UnitOfMeasurementId;
            existingBenefit.ApprovalStatus = ApprovalStatus.Draft;

            await _dataService.SaveAsync(cancellationToken);
            return request.Id;
        }
    }
}

