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
    public class GetAllBenefitsQueryHandler : IRequestHandler<GetAllBenefitsQuery, List<BenefitDto>>
    {
        private readonly IDataService _dataService;

        public GetAllBenefitsQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<List<BenefitDto>> Handle(GetAllBenefitsQuery request, CancellationToken cancellationToken)
        {
            var benefits = await _dataService.Benefits
               .Select(b => new BenefitDto
               {
                   Id = b.Id,
                   Name = b.Name,
                   UnitOfMeasurementId = b.UnitOfMeasurementId,
                   UnitName = b.UnitOfMeasurement.Name, // Assumes navigation property exists
                   ApprovalStatus = b.ApprovalStatus,
                   IsActive = b.IsActive
               })
               .ToListAsync(cancellationToken);

            return benefits;
        }
    }

}
