using AutoMapper;
using CMS.Application.Features.Employees.Family.Model;
using CMS.Application.Features.Employees.Experience.Model;
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

namespace CMS.Application.Features.Employees.Experience.Queries
{
    public record GetEmployeeExperienceListOfEmployeeQuery(int EmployeeId) : IRequest<List<EmployeeExperienceDto>>;
    public class GetEmployeeExperienceListOfEmployeeHandler : IRequestHandler<GetEmployeeExperienceListOfEmployeeQuery, List<EmployeeExperienceDto>>
    {
        public readonly IDataService dataService;
        public readonly IMapper mapper;

        public GetEmployeeExperienceListOfEmployeeHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<List<EmployeeExperienceDto?>> Handle(GetEmployeeExperienceListOfEmployeeQuery request, CancellationToken cancellationToken)
        {
            var employeeExperience = await dataService.EmployeeExperiences
                .Where(s => s.EmployeeId == request.EmployeeId)
                .ToListAsync(cancellationToken);  

            var employeeExperienceList = new List<EmployeeExperienceDto>();

            foreach (var experience in employeeExperience)
            {
                var experienceDto = new EmployeeExperienceDto
                {
                    Id = experience.Id,
                    FirmName = experience.FirmName,
                    StartDate = experience.StartDate,
                    EndDate = experience.EndDate,
                    JobTitle = experience.JobTitle,
                    City = experience.City,
                    LastSalary = experience.LastSalary,
                    ReasonForResignation = experience.ReasonForResignation,
                    ExperienceType = experience.ExperienceType,
                    EmployeeId = experience.EmployeeId,
                };

                employeeExperienceList.Add(experienceDto);
            }

            return employeeExperienceList;
        }



    }


}