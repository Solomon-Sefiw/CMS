using AutoMapper;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application;
public class GetCaseDetailQuery : IRequest<CaseDetailsDto>
{
    public int Id { get; set; }
}
public class GetCaseDetailQueryHandler : IRequestHandler<GetCaseDetailQuery, CaseDetailsDto>
{
    private readonly IMapper mapper;
    private readonly IDataService dataservice;

    public GetCaseDetailQueryHandler(IMapper mapper, IDataService dataservice)
    {
        this.mapper = mapper;
        this.dataservice = dataservice;
    }


    public async Task<CaseDetailsDto> Handle(GetCaseDetailQuery request, CancellationToken cancellationToken)
    {
        var employee = await dataservice
            .Cases
            .Include(s => s.Documents)
            .AsSplitQuery()
            .FirstOrDefaultAsync(sh => sh.Id == request.Id);

        return mapper.Map<CaseDetailsDto>(employee);
    }
}
