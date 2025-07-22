using AutoMapper;
using Azure;
using CMS.Application.Features.Employees;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application.Features.Employees.Experience.Commands
{
    public class UpdateEmployeeExperienceCommandHandler : IRequestHandler<UpdateEmployeeExperienceCommand, int>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataService;
        public UpdateEmployeeExperienceCommandHandler(IMapper mapper, IDataService dataService)
        {
            this.mapper = mapper;
            this.dataService = dataService;
        }
        public async Task<int> Handle(UpdateEmployeeExperienceCommand request, CancellationToken cancellationToken)
        {
            var experience = await dataService.EmployeeExperiences.FindAsync(request.Id);

            if (experience == null)
            {
                throw new Exception("Experience record not found");
            }

            experience.FirmName = request.FirmName;
            experience.StartDate = request.StartDate;
            experience.EndDate = request.EndDate;
            experience.JobTitle = request.JobTitle;
            experience.City = request.City;
            experience.LastSalary = request.LastSalary;
            experience.ReasonForResignation = request.ReasonForResignation;
            experience.ExperienceType = request.ExperienceType;
            experience.EmployeeId = request.EmployeeId;
            await dataService.SaveAsync(cancellationToken);
            return experience.Id;
        }

    }
}
