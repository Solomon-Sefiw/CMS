using AutoMapper;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Judgment.Commands.UpdateJudgment
{
    public class UpdateJudgmentCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public string HtmlContent { get; set; } = string.Empty;
        public string? PdfFilePath { get; set; }
        public string? SignedByUserId { get; set; }
        public DateTime? SignedAt { get; set; }
        public string? FileHash { get; set; }
        public bool IsPublished { get; set; } = false;
        public DateTime? PublishedAt { get; set; }
    }

    public class UpdateJudgmentCommandHandler : IRequestHandler<UpdateJudgmentCommand, bool>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public UpdateJudgmentCommandHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<bool> Handle(UpdateJudgmentCommand request, CancellationToken cancellationToken)
        {
            var entity = await dataService.Judgments
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (entity == null) return false;

            mapper.Map(request, entity);

            await dataService.SaveAsync(cancellationToken);
            return true;
        }
    }
}
