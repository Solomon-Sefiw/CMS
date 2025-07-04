using AutoMapper;
using CMS.Application.Features.Employees.Family.Model;
using CMS.Application.Features.Employees.Experience.Model;
using CMS.Application.Features.Employees.Queries;
using CMS.Domain.Employee;
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

namespace CMS.Application.Features.Employees.Guranters.Queries
{
    public record GetEmployeeGurantersByIdQuery(int Id) : IRequest<List<EmployeeGurantersDto>>;
    public class GetEmployeeGurantersByIdHandler : IRequestHandler<GetEmployeeGurantersByIdQuery, List<EmployeeGurantersDto>>
    {
        public readonly IDataService dataService;
        public readonly IMapper mapper;
        public GetEmployeeGurantersByIdHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<List<EmployeeGurantersDto>> Handle(GetEmployeeGurantersByIdQuery request, CancellationToken cancellationToken)
        {
            var employeeGuranters = await dataService.EmployeeGuranteries
                .Where(s => s.Id == request.Id)
                .Include(e => e.employee)
                .ToListAsync(cancellationToken);

            var employeeGurantersList = new List<EmployeeGurantersDto>();

            foreach (var guarantorInfo in employeeGuranters)
            {
                var guarantorDto = new EmployeeGurantersDto
                {
                    Id = guarantorInfo.Id,
                    IdentificationCardNo = guarantorInfo.IdentificationCardNo,
                    Name = guarantorInfo.Name,
                    FathersName = guarantorInfo.FathersName,
                    GrandfathersName = guarantorInfo.GrandfathersName,
                    WorkingFirm= guarantorInfo.WorkingFirm,
                    EmployeeId = guarantorInfo.EmployeeId,
                    Referenceno = guarantorInfo.Referenceno,
                    Salary = guarantorInfo.Salary,
                    GuaranteeType= guarantorInfo.GuaranteeType,
                    Active = guarantorInfo.Active,
                    FromDate = guarantorInfo.FromDate,
                    ToDate = guarantorInfo.ToDate,
                };

                employeeGurantersList.Add(guarantorDto);
            }

            return employeeGurantersList;
        }

    }
}