using AutoMapper;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Judgment.Commands.CreateJudgment
{
    public class CreateJudgmentCommand : IRequest<int>
    {
        public int CaseId { get; set; }
        public string HtmlContent { get; set; } = string.Empty;
        public string? PdfFilePath { get; set; }
        public string? SignedByUserId { get; set; }
        public DateTime? SignedAt { get; set; }
        public string? FileHash { get; set; }
        public bool IsPublished { get; set; } = false;
        public DateTime? PublishedAt { get; set; }
    }

    public class CreateJudgmentCommandHandler : IRequestHandler<CreateJudgmentCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public CreateJudgmentCommandHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<int> Handle(CreateJudgmentCommand request, CancellationToken cancellationToken)
        {
            var entity = mapper.Map<Domain.Judgments.Judgment>(request);
            await dataService.Judgments.AddAsync(entity, cancellationToken);
            await dataService.SaveAsync(cancellationToken);
            return entity.Id;
        }
    }
}
