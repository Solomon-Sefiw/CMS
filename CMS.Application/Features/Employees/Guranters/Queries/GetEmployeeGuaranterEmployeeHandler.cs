using AutoMapper;
using CMS.Application.Features.Employees.Family.Model;
using CMS.Application.Features.Employees.Experience.Model;
using CMS.Application.Features.Employees.Experience.Queries;
using CMS.Application.Features.Employees.Queries;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.Guranters.Queries
{
    public record GetEmployeeGuaranterQuery(int EmployeeId) : IRequest<List<EmployeeGurantersDto>>;
    public class GetEmployeeGuaranterEmployeeHandler : IRequestHandler<GetEmployeeGuaranterQuery, List<EmployeeGurantersDto>>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetEmployeeGuaranterEmployeeHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<List<EmployeeGurantersDto>> Handle(GetEmployeeGuaranterQuery request, CancellationToken cancellationToken)
        {
            var employeeGuranters = await dataService.EmployeeGuranteries
                .Where(s => s.EmployeeId == request.EmployeeId)
                .Include(e => e.employee)  
                .ToListAsync(cancellationToken);

            var employeeGurantersDtoList = employeeGuranters.Select(guarantor => new EmployeeGurantersDto
            {
                Id = guarantor.Id,
                IdentificationCardNo = guarantor.IdentificationCardNo,
                Name = guarantor.Name,
                FathersName = guarantor.FathersName,
                GrandfathersName = guarantor.GrandfathersName,
                WorkingFirm= guarantor.WorkingFirm,
                EmployeeId = guarantor.EmployeeId,
                //
                Referenceno= guarantor.Referenceno,
                Salary = guarantor.Salary,
                GuaranteeType= guarantor.GuaranteeType,
                  Active = guarantor.Active,
                  FromDate = guarantor.FromDate,
                  ToDate = guarantor.ToDate,
            }).ToList();

            return employeeGurantersDtoList;
        }

    }



}