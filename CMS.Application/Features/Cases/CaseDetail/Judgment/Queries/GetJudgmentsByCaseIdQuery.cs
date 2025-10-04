using AutoMapper;
using CMS.Application.Features.Cases.CaseDetail.Judgment.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Judgment.Queries
{
    public record GetJudgmentsByCaseIdQuery(int CaseId) : IRequest<List<JudgmentDto>>;

    public class GetJudgmentsByCaseIdQueryHandler : IRequestHandler<GetJudgmentsByCaseIdQuery, List<JudgmentDto>>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetJudgmentsByCaseIdQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<List<JudgmentDto>> Handle(GetJudgmentsByCaseIdQuery request, CancellationToken cancellationToken)
        {
            var judgments = await dataService.Judgments
                .Include(j => j.Case)
                .Include(j => j.SignedBy)
                .Where(j => j.CaseId == request.CaseId)
                .ToListAsync(cancellationToken);

            return mapper.Map<List<JudgmentDto>>(judgments);
        }
    }
}
