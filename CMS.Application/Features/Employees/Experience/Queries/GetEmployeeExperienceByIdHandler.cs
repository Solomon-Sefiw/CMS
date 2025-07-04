using AutoMapper;
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

namespace CMS.Application.Features.Employees.Experience.Queries
{
    public record GetEmployeeExperienceByIdQuery(int Id) : IRequest<List<EmployeeExperience>>;
    public class GetEmployeeExperienceByIdHandler : IRequestHandler<GetEmployeeExperienceByIdQuery, List<EmployeeExperience>>
    {
        public readonly IDataService dataService;
        public readonly IMapper mapper;
        public GetEmployeeExperienceByIdHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<List<EmployeeExperience>> Handle(GetEmployeeExperienceByIdQuery request, CancellationToken cancellationToken)
        {
            var employeeExperiences = await dataService.EmployeeExperiences
                .Where(s => s.Id == request.Id) 
                .Include(e => e.Employee) 
                .ToListAsync(cancellationToken); 
            var employeeExperienceList = new List<EmployeeExperience>();

            foreach (var experienceInfo in employeeExperiences)
            {
                var experience = new EmployeeExperience
                {
                    Id = experienceInfo.Id,
                    FirmName = experienceInfo.FirmName,
                    StartDate = experienceInfo.StartDate,
                    EndDate = experienceInfo.EndDate,
                    JobTitle = experienceInfo.JobTitle,
                    City = experienceInfo.City,
                    LastSalary = experienceInfo.LastSalary,
                    ReasonForResignation = experienceInfo.ReasonForResignation,
                    EmployeeId = experienceInfo.EmployeeId,
                };

                employeeExperienceList.Add(experience);
            }

            return employeeExperienceList;
        }
    }
}