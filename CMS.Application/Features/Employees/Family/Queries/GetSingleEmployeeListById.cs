using AutoMapper;
using CMS.Domain.Enums;
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
    public class GetSingleEmployeeListById : IRequest<bool>
    {
        public MartialStatus Single { get; set; }
    }
    public class GetSingleEmployeeListByIdHandler : IRequestHandler<GetSingleEmployeeListById, bool>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataservice;

        public GetSingleEmployeeListByIdHandler(IMapper mapper, IDataService dataservice)
        {
            this.mapper = mapper;
            this.dataservice = dataservice;
        }
        public async Task<bool> Handle(GetSingleEmployeeListById request, CancellationToken cancellationToken)
        {
            var newemployeeList = new List<EmployeeDto>();

            var employeeExists = await dataservice
      .Employees
      .AnyAsync(a => a.MartialStatus == request.Single); // Checks if any employee has the given martial status
            return employeeExists;
        }
    }
}