using AutoMapper;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.CaseTemplates.Commands.UpdateCaseTemplate
{
    public class UpdateCaseTemplateCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }

    public class UpdateCaseTemplateCommandHandler : IRequestHandler<UpdateCaseTemplateCommand, bool>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public UpdateCaseTemplateCommandHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<bool> Handle(UpdateCaseTemplateCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dataService.CaseTemplates
                .FirstOrDefaultAsync(ct => ct.Id == request.Id, cancellationToken);

            if (entity == null) return false;

            _mapper.Map(request, entity);
            _dataService.CaseTemplates.Update(entity);
            await _dataService.SaveAsync(cancellationToken);

            return true;
        }
    }
}
