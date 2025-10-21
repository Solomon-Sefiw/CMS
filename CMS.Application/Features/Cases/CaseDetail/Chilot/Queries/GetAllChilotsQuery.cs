using AutoMapper;
using CMS.Application.Features.Cases.CaseDetail.Chilot.Models;
using CMS.Application.Features.Educations.Setups.Award.Models;
using CMS.Domain.Education.awards;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace CMS.Application.Features.Cases.CaseDetail.Chilot.Queries
{
    // Query
    public record GetAllChilotsQuery() : IRequest<ChilotLists>;
    public record ChilotLists(
         IEnumerable<ChilotDto> Approved,
         IEnumerable<ChilotDto> Submitted,
         IEnumerable<ChilotDto> Rejected,
         IEnumerable<ChilotDto> Draft
);

    public class GetAllChilotsQueryHandler : IRequestHandler<GetAllChilotsQuery, ChilotLists>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetAllChilotsQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<ChilotLists> Handle(GetAllChilotsQuery query, CancellationToken cancellationToken)
        {
            var chilots = await dataService.Chillots
                .ToListAsync(cancellationToken);

            var awards =  mapper.Map<List<ChilotDto>>(chilots);

            var approved = awards.Where(r => r.ApprovalStatus == ApprovalStatus.Approved).ToList();
            var submitted = awards.Where(r => r.ApprovalStatus == ApprovalStatus.Submitted).ToList();
            var rejected = awards.Where(r => r.ApprovalStatus == ApprovalStatus.Rejected).ToList();
            var draft = awards.Where(r => r.ApprovalStatus == ApprovalStatus.Draft).ToList();


            return new ChilotLists(
              Approved: approved,
              Rejected: rejected,
              Submitted: submitted,
              Draft: draft
              );
        }
    }
}
