using AutoMapper;
using AutoMapper.QueryableExtensions;
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
    public class GetAllEmployeesOnProbationQuery : IRequest<List<EmployeeDto>>
    {
    }
    public class GetAllEmployeesOnProbationQueryHandler : IRequestHandler<GetAllEmployeesOnProbationQuery, List<EmployeeDto>>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataservice;

        public GetAllEmployeesOnProbationQueryHandler(IMapper mapper, IDataService dataservice)
        {
            this.mapper = mapper;
            this.dataservice = dataservice;
        }


        public async Task<List<EmployeeDto>> Handle(GetAllEmployeesOnProbationQuery request, CancellationToken cancellationToken)
        {
            var employee = await dataservice.Employees
                .Where(a => a.EmployeeStatus == Domain.Enums.EmployeeStatusEnum.UnderProbation &&
                a.ApprovalStatus == Domain.Enum.ApprovalStatus.Approved).Include(a => a.BusinessUnits)
                .Include(a => a.Job).ThenInclude(a => a.JobRole)
                .ProjectTo<EmployeeDto>(mapper.ConfigurationProvider).ToListAsync();

            return employee;
        }
    }
}
