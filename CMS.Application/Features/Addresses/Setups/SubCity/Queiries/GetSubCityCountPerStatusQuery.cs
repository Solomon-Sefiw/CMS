using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Addresses.Setups.SubCity.Queiries
{


    public record SubCityCountsByStatus(int Approved, int Submitted, int Rejected, int Draft);
    public record GetSubCityCountPerStatusQuery() : IRequest<SubCityCountsByStatus>;

    public class GetSubCityCountPerStatusQueryHandler : IRequestHandler<GetSubCityCountPerStatusQuery, SubCityCountsByStatus>
    {
        private readonly IDataService _dataService;

        public GetSubCityCountPerStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<SubCityCountsByStatus> Handle(GetSubCityCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var approvedCount = await _dataService.SubCities
                .Where(r => r.ApprovalStatus == ApprovalStatus.Approved)
                .CountAsync(cancellationToken);

            var submittedCount = await _dataService.SubCities
                .Where(r => r.ApprovalStatus == ApprovalStatus.Submitted)
                .CountAsync(cancellationToken);

            var rejectedCount = await _dataService.SubCities
                .Where(r => r.ApprovalStatus == ApprovalStatus.Rejected)
                .CountAsync(cancellationToken);

            var draftCount = await _dataService.SubCities
                .Where(r => r.ApprovalStatus == ApprovalStatus.Draft)
                .CountAsync(cancellationToken);

            return new SubCityCountsByStatus(approvedCount, submittedCount, rejectedCount, draftCount);
        }
    }
}
