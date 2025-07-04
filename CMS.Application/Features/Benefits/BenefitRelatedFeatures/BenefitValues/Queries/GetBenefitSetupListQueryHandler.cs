using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Model;
using CMS.Application.Features.Benefits.Model;
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
    public class GetBenefitSetupListQueryHandler : IRequestHandler<GetBenefitSetupListQuery, List<BenefitSetupDto>>
    {
        private readonly IDataService _dataService;

        public GetBenefitSetupListQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<List<BenefitSetupDto>> Handle(GetBenefitSetupListQuery request, CancellationToken cancellationToken)
        {
            return await _dataService.Benefits
                .Include(b => b.UnitOfMeasurement)
                .Include(b => b.BenefitValues)
                .Select(b => new BenefitSetupDto
                {
                    BenefitId = b.Id,
                    BenefitName = b.Name,
                    Unit = b.UnitOfMeasurement.Name,
                    Values = b.BenefitValues.Select(v => new BenefitValueDto
                    {
                        Id = v.Id,
                        Value = v.Value
                    }).ToList()
                }).ToListAsync(cancellationToken);
        }
    }

}
