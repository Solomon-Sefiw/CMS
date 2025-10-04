using AutoMapper;
using CMS.Domain.Templates;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.CaseTemplates.Commands.CreateCaseTemplate
{
    public class CreateCaseTemplateCommand : IRequest<int>
    {
        public string Name { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? CreatedById { get; set; }
    }

    public class CreateCaseTemplateCommandHandler : IRequestHandler<CreateCaseTemplateCommand, int>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public CreateCaseTemplateCommandHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<int> Handle(CreateCaseTemplateCommand request, CancellationToken cancellationToken)
        {
            var entity = _mapper.Map<CaseTemplate>(request);
            entity.CreatedAt = DateTime.UtcNow;

            await _dataService.CaseTemplates.AddAsync(entity, cancellationToken);
            await _dataService.SaveAsync(cancellationToken);

            return entity.Id;
        }
    }
}
