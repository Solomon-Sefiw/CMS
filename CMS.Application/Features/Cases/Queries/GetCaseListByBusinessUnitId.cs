using AutoMapper;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.Queries
{
    public class GetCaseListByBusinessUnitId : IRequest<List<CaseDto>>
    {
        public int Id { get; set; }
    }
    public class GetCaseListByBusinessUnitIdQueryHandler : IRequestHandler<GetCaseListByBusinessUnitId, List<CaseDto>>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataservice;

        public GetCaseListByBusinessUnitIdQueryHandler(IMapper mapper, IDataService dataservice)
        {
            this.mapper = mapper;
            this.dataservice = dataservice;
        }
        public async Task<List<CaseDto>> Handle(GetCaseListByBusinessUnitId request, CancellationToken cancellationToken)
        {
            var newcaseList = new List<CaseDto>();
            
            var caseList = await dataservice
                .Cases.Include(a => a.Payments).Include(a => a.Hearings)
                .Include(a => a.BusinessUnit).Include(a => a.Judgments).ToListAsync();
           
            return mapper.Map<List<CaseDto>>(caseList);
        }
    }
}
