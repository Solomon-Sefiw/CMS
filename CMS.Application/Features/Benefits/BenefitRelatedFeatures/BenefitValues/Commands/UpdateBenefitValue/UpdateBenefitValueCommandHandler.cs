using CMS.Application.Exceptions;
using CMS.Domain.Benefit;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Commands.UpdateBenefitValue
{
    public class UpdateBenefitValueCommandHandler : IRequestHandler<UpdateBenefitValueCommand, int>
    {
        private readonly IDataService _dataService;

        public UpdateBenefitValueCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<int> Handle(UpdateBenefitValueCommand request, CancellationToken cancellationToken)
        {
            var benefitValue = await _dataService.BenefitValues.Where(b => b.Id == request.Id).FirstOrDefaultAsync();

            if (benefitValue != null)
            {
                benefitValue.BenefitId = request.benefitId;
                benefitValue.Value = request.value;
                benefitValue.ApprovalStatus = ApprovalStatus.Draft;
                benefitValue.Description = request.description;
            }
            await _dataService.SaveAsync(cancellationToken);
            return request.Id;
        }
    }

}
