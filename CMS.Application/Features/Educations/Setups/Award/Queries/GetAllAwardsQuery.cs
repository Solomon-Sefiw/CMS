
using CMS.Application.Features.Addresses.Setups.Models;
using CMS.Application.Features.Addresses.Setups.Queiries;
using CMS.Application.Features.Educations.Setups.Award.Models;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Educations.Setups.Award.Queries
{
    public record GetAllAwardsQuery() : IRequest<AwardLists>;
    public record AwardLists(
         IEnumerable<AwardDto> Approved,
         IEnumerable<AwardDto> Submitted,
         IEnumerable<AwardDto> Rejected,
         IEnumerable<AwardDto> Draft
);

    public class GetAllAwardsQueryHandler : IRequestHandler<GetAllAwardsQuery, AwardLists>
    {
        private readonly IDataService dataService;

        public GetAllAwardsQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<AwardLists> Handle(GetAllAwardsQuery query, CancellationToken cancellationToken)
        {
            var awards = await dataService.Awards
                .Select(a => new AwardDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Description = a.Description,
                    ApprovalStatus = a.ApprovalStatus,
                })
                .ToListAsync(cancellationToken);

            var approved = awards.Where(r => r.ApprovalStatus == ApprovalStatus.Approved).ToList();
            var submitted = awards.Where(r => r.ApprovalStatus == ApprovalStatus.Submitted).ToList();
            var rejected = awards.Where(r => r.ApprovalStatus == ApprovalStatus.Rejected).ToList();
            var draft = awards.Where(r => r.ApprovalStatus == ApprovalStatus.Draft).ToList();


            return new AwardLists(
              Approved: approved,
              Rejected: rejected,
              Submitted: submitted,
              Draft: draft
              );
        }
    }
}
