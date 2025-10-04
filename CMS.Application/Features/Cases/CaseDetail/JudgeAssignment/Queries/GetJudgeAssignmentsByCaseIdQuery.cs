using AutoMapper;
using CMS.Application.Features.Cases.CaseDetail.JudgeAssignment.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Cases.CaseDetail.JudgeAssignment.Queries
{
    public record GetJudgeAssignmentsByCaseIdQuery(int CaseId) : IRequest<List<JudgeAssignmentDto>>;

    public class GetJudgeAssignmentsByCaseIdQueryHandler : IRequestHandler<GetJudgeAssignmentsByCaseIdQuery, List<JudgeAssignmentDto>>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetJudgeAssignmentsByCaseIdQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<List<JudgeAssignmentDto>> Handle(GetJudgeAssignmentsByCaseIdQuery request, CancellationToken cancellationToken)
        {
            var query = await dataService.JudgeAssignments
                .Include(x => x.Judge)
                .Include(x => x.Case)
                .Include(x => x.Chilot)
                .Include(x => x.BusinessUnit)
                .Where(x => x.CaseId == request.CaseId)
                .ToListAsync(cancellationToken);

            return mapper.Map<List<JudgeAssignmentDto>>(query);
        }
    }
}
