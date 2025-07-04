using AutoMapper;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application;
public class GetEmployeeDetailQuery : IRequest<EmployeeDetailsDto>
{
    public int Id { get; set; }
}
public class GetEmployeeDetailQueryHandler : IRequestHandler<GetEmployeeDetailQuery, EmployeeDetailsDto>
{
    private readonly IMapper mapper;
    private readonly IDataService dataservice;

    public GetEmployeeDetailQueryHandler(IMapper mapper, IDataService dataservice)
    {
        this.mapper = mapper;
        this.dataservice = dataservice;
    }


    public async Task<EmployeeDetailsDto> Handle(GetEmployeeDetailQuery request, CancellationToken cancellationToken)
    {
        var employee = await dataservice
            .Employees
            .Include(s => s.EmployeeDocuments)
            .AsSplitQuery()
            .FirstOrDefaultAsync(sh => sh.Id == request.Id);

        return mapper.Map<EmployeeDetailsDto>(employee);
    }
}
