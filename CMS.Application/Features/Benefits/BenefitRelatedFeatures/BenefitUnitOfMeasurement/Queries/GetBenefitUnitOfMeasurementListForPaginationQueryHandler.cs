
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Model;
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
    public class GetBenefitUnitOfMeasurementListForPaginationQueryHandler : IRequestHandler<GetBenefitUnitOfMeasurementListForPaginationQuery, BenefitUnitOfMeasurementSearchResult>
    {
        private readonly IDataService _dataService;
        public GetBenefitUnitOfMeasurementListForPaginationQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<BenefitUnitOfMeasurementSearchResult> Handle(GetBenefitUnitOfMeasurementListForPaginationQuery request, CancellationToken cancellationToken)
        {
            var unitOfMeasurementQuery = _dataService.BenefitUnitOfMeasurements.AsQueryable();

            unitOfMeasurementQuery = unitOfMeasurementQuery.Where(j => j.ApprovalStatus == request.Status);
            var unitOfMeasurementPaginated = unitOfMeasurementQuery
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize);

            var unitOfMeasurementList = await unitOfMeasurementPaginated.ToListAsync(cancellationToken);
            var count = await unitOfMeasurementQuery.CountAsync(cancellationToken);

            var result = unitOfMeasurementList.Select(unitOfMeasurement => new BenefitUnitOfMeasurementDto
            {
                Id = unitOfMeasurement.Id,
                Name = unitOfMeasurement.Name,
                IsUnitPriced=unitOfMeasurement.IsUnitPriced,
                Description = unitOfMeasurement.Description,
                Remark = unitOfMeasurement.Remark,
                ApprovalStatus = unitOfMeasurement.ApprovalStatus,
            }).ToList();

            return new BenefitUnitOfMeasurementSearchResult(result, count);
        }
    }
}
