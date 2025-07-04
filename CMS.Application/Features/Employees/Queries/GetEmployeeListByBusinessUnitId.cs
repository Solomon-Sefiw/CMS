using AutoMapper;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.Queries
{
    public class GetEmployeeListByBusinessUnitId : IRequest<List<EmployeeDto>>
    {
        public int Id { get; set; }
    }
    public class GetEmployeeListByBusinessUnitIdQueryHandler : IRequestHandler<GetEmployeeListByBusinessUnitId, List<EmployeeDto>>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataservice;

        public GetEmployeeListByBusinessUnitIdQueryHandler(IMapper mapper, IDataService dataservice)
        {
            this.mapper = mapper;
            this.dataservice = dataservice;
        }
        public async Task<List<EmployeeDto>> Handle(GetEmployeeListByBusinessUnitId request, CancellationToken cancellationToken)
        {
            var newemployeeList = new List<EmployeeDto>();
            
            var employeeList = await dataservice
                .Employees.Where(a=>a.BusinessUnitID==request.Id)
                .Include(a=>a.BusinessUnits).Include(a=>a.Job).ThenInclude(a=>a.JobRole).ToListAsync();
           
            return mapper.Map<List<EmployeeDto>>(employeeList);
        }
    }
}
