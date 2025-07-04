using CMS.Application.Exceptions;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Model;
using CMS.Domain.Benefit;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Queries
{
    public class GetBenefitValueByIdQueryHandler : IRequestHandler<GetBenefitValueByIdQuery, BenefitValueDto>
    {
        private readonly IDataService _dataService;

        public GetBenefitValueByIdQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<BenefitValueDto> Handle(GetBenefitValueByIdQuery request, CancellationToken cancellationToken)
        {
            var benefitValue = await _dataService.BenefitValues
                .Where(bv => bv.Id == request.Id)
                .Select(bv => new BenefitValueDto
                {
                    Id = bv.Id,
                    BenefitId = bv.BenefitId,
                    Value = bv.Value
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (benefitValue == null)
                throw new NotFoundException(nameof(BenefitValue), request.Id);

            return benefitValue;
        }
    }

}
