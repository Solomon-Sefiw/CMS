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
    public record GetDocketEntryByIdQuery(int Id) : IRequest<DocketEntryDto?>;

    public class GetDocketEntryByIdQueryHandler : IRequestHandler<GetDocketEntryByIdQuery, DocketEntryDto?>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public GetDocketEntryByIdQueryHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<DocketEntryDto?> Handle(GetDocketEntryByIdQuery request, CancellationToken cancellationToken)
        {
            var entity = await _dataService.DocketEntries
                .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);

            return entity == null ? null : _mapper.Map<DocketEntryDto>(entity);
        }
    }
}
