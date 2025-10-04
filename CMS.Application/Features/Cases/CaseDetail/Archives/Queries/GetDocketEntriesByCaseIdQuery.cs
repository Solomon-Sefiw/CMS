using AutoMapper;
using CMS.Application.Features.Cases.CaseDetail.Archives.Models;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Archives.Queries
{
    public record GetDocketEntriesByCaseIdQuery(int CaseId) : IRequest<List<DocketEntryDto>>;

    public class GetDocketEntriesByCaseIdQueryHandler : IRequestHandler<GetDocketEntriesByCaseIdQuery, List<DocketEntryDto>>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetDocketEntriesByCaseIdQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<List<DocketEntryDto>> Handle(GetDocketEntriesByCaseIdQuery request, CancellationToken cancellationToken)
        {
            var list = await _dataService.DocketEntries
                .Where(d => d.CaseId == request.CaseId)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<DocketEntryDto>>(list);
        }
    }
}
