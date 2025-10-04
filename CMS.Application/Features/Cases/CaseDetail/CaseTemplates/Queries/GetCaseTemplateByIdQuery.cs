using AutoMapper;
using CMS.Application.Features.Cases.CaseDetail.CaseTemplates.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.CaseTemplates.Queries
{
    public record GetCaseTemplateByIdQuery(int Id) : IRequest<CaseTemplateDto?>;

    public class GetCaseTemplateByIdQueryHandler : IRequestHandler<GetCaseTemplateByIdQuery, CaseTemplateDto?>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetCaseTemplateByIdQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<CaseTemplateDto?> Handle(GetCaseTemplateByIdQuery request, CancellationToken cancellationToken)
        {
            var entity = await _dataService.CaseTemplates
                .Include(c => c.CreatedBy)
                .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            return entity == null ? null : _mapper.Map<CaseTemplateDto>(entity);
        }
    }
}
