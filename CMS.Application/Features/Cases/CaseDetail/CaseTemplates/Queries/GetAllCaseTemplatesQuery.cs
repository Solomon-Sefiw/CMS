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
    public record GetAllCaseTemplatesQuery : IRequest<List<CaseTemplateDto>>;

    public class GetAllCaseTemplatesQueryHandler : IRequestHandler<GetAllCaseTemplatesQuery, List<CaseTemplateDto>>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetAllCaseTemplatesQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<List<CaseTemplateDto>> Handle(GetAllCaseTemplatesQuery request, CancellationToken cancellationToken)
        {
            var list = await _dataService.CaseTemplates
                .Include(c => c.CreatedBy)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<CaseTemplateDto>>(list);
        }
    }
}
