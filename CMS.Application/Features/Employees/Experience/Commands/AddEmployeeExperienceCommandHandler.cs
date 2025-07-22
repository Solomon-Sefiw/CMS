using AutoMapper;
using CMS.Application.Features.Employees;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application.Features.Employees.Experience.Commands
{
    public class AddEmployeeExperienceCommandHandler : IRequestHandler<AddEmployeeExperienceCommand, int>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataService;
        public AddEmployeeExperienceCommandHandler(IMapper mapper, IDataService dataService)
        {
            this.mapper = mapper;
            this.dataService = dataService;
        }
        public async Task<int> Handle(AddEmployeeExperienceCommand request, CancellationToken cancellationToken)
        {
            var EmployeeExperience = new EmployeeExperience
            {
                EmployeeId = request.EmployeeId,
                FirmName = request.FirmName,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                JobTitle = request.JobTitle,
                City = request.City,
                LastSalary = request.LastSalary,
                ReasonForResignation = request.ReasonForResignation,
                ExperienceType = request.ExperienceType 
            };
            dataService.EmployeeExperiences.Add(EmployeeExperience);
            await dataService.SaveAsync(cancellationToken);
            return EmployeeExperience.Id;
        }

    }
}
