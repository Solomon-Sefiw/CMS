
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Model;
using CMS.Domain.Benefit;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Queries
{
    public class GetAllBenefitUnitOfMeasurementQueryHandler : IRequestHandler<GetAllBenefitUnitOfMeasurementQuery, List<BenefitUnitOfMeasurementDto>>
    {
        private readonly IDataService _dataService;

        public GetAllBenefitUnitOfMeasurementQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<List<BenefitUnitOfMeasurementDto>> Handle(GetAllBenefitUnitOfMeasurementQuery request, CancellationToken cancellationToken)
        {
            return await _dataService.BenefitUnitOfMeasurements
            .Select(b => new BenefitUnitOfMeasurementDto
            {
                Id = b.Id,
                Name = b.Name,
                IsUnitPriced=b.IsUnitPriced,
                Description = b.Description,
                Remark = b.Remark,
                ApprovalStatus = b.ApprovalStatus
            })
            .ToListAsync(cancellationToken);
        }
    }
}
