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
    public record GetAllDocketEntriesQuery : IRequest<List<DocketEntryDto>>;

    public class GetAllDocketEntriesQueryHandler : IRequestHandler<GetAllDocketEntriesQuery, List<DocketEntryDto>>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetAllDocketEntriesQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<List<DocketEntryDto>> Handle(GetAllDocketEntriesQuery request, CancellationToken cancellationToken)
        {
            var list = await _dataService.DocketEntries.ToListAsync(cancellationToken);
            return _mapper.Map<List<DocketEntryDto>>(list);
        }
    }
}
