using AutoMapper;
using CMS.Application.Features.Employees.Family.Model;
using CMS.Application.Features.Employees.Queries;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.Family.Queries
{
    public record GetEmployeeFamilyListQuery : IRequest<List<EmployeeFamilyDto>>;
    public class GetEmployeeFamilyListHandler : IRequestHandler<GetEmployeeFamilyListQuery, List<EmployeeFamilyDto>>
    {
        public readonly IDataService dataService;
        public readonly IMapper mapper;

        public GetEmployeeFamilyListHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<List<EmployeeFamilyDto?>> Handle(GetEmployeeFamilyListQuery request, CancellationToken cancellationToken)
        {
            var employeeFamily = await dataService.EmployeeFamilies
      .Include(a => a.Employees) 
      .ToListAsync();

            var employeeFamilyList = new List<EmployeeFamilyDto>();

            foreach (var family in employeeFamily)
            {
                var familyInformation = new EmployeeFamilyDto
                {

                };

                employeeFamilyList.Add(familyInformation);
            }

            return employeeFamilyList;

        }
   

    }


}