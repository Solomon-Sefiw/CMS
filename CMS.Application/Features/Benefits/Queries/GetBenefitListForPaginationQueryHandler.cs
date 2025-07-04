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
    public class GetBenefitListForPaginationQueryHandler : IRequestHandler<GetBenefitListForPaginationQuery, BenefitSearchResult>
    {
        private readonly IDataService _dataService;
        public GetBenefitListForPaginationQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<BenefitSearchResult> Handle(GetBenefitListForPaginationQuery request, CancellationToken cancellationToken)
        {
            var query = _dataService.Benefits
                .Include(b => b.UnitOfMeasurement)
                .Where(b => b.ApprovalStatus == request.Status)
                .AsQueryable();

            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderByDescending(b => b.Id)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
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

            return new BenefitSearchResult(items, totalCount);
        }
    }
}
