using CMS.Application.Features.Benefits.Model;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.Queries
{
    public class GetAllUnitPricedBenefitQueryHandler : IRequestHandler<GetAllUnitPricedBenefitQuery, List<BenefitDto>>
    {
        private readonly IDataService _dataService;

        public GetAllUnitPricedBenefitQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<List<BenefitDto>> Handle(GetAllUnitPricedBenefitQuery request, CancellationToken cancellationToken)
        {
            var benefits = await _dataService.Benefits
                .Where(b => b.UnitOfMeasurement.IsUnitPriced)
                .Select(b => new BenefitDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    UnitOfMeasurementId = b.UnitOfMeasurementId,
                    UnitName = b.UnitOfMeasurement.Name,
                    ApprovalStatus = b.ApprovalStatus,
                    IsActive = b.IsActive,
                    Remark = b.Remark
                })
                .ToListAsync(cancellationToken);

            return benefits;
        }
    }
}
