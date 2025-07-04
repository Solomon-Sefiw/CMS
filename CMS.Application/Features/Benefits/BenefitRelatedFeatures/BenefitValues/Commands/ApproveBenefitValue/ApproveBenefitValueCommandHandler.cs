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

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Commands.ApproveBenefitValue
{
    public class ApproveBenefitValueCommandHandler : IRequestHandler<ApproveBenefitValueCommand, int>
    {
        private readonly IDataService _dataService;
        public ApproveBenefitValueCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<int> Handle(ApproveBenefitValueCommand request, CancellationToken cancellationToken)
        {
            var benefitValue = await _dataService.BenefitValues.Where(b => b.Id == request.Id).FirstOrDefaultAsync();

            if (benefitValue == null)
            {
                throw new NotFoundException(nameof(BenefitValue), request.Id);
            }
            benefitValue.ApprovalStatus = ApprovalStatus.Approved;
            benefitValue.Remark = request.remark;

            await _dataService.SaveAsync(cancellationToken);
            return request.Id;
        }
    }
}
