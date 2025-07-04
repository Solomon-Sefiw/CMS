using AutoMapper;
using CMS.Domain.Employee;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application.Features.Employees.Commands
{
    public class CreateEmployeeProfileCommandHandler : IRequestHandler<CreateEmployeeProfileCommand, CreateEmployeeProfileReturnType>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataService;
        public CreateEmployeeProfileCommandHandler(IMapper mapper, IDataService dataService)
        {
            this.mapper = mapper;
            this.dataService = dataService;
        }
        public async Task<CreateEmployeeProfileReturnType> Handle(CreateEmployeeProfileCommand request, CancellationToken cancellationToken)
        {
           var  displayName = request.FirstName + " "+ request.MiddleName +" "+ request.LastName;
            var amharicDisplayName = request.AmharicFirstName +" "+ request.AmharicMiddleName +" "+request.AmharicLastName;
            var employee = mapper.Map<Employee>(request);
            employee.DisplayName = displayName;
            employee.AmharicDisplayName = amharicDisplayName;

            var vacantJob = dataService.Jobs
                      .Where(jb => jb.Id == employee.JobId)
                      .ExecuteUpdate(jb => jb.SetProperty(job => job.IsVacant, false));

            dataService.Employees.Add(employee);

            await dataService.SaveAsync(cancellationToken);
            return new CreateEmployeeProfileReturnType(id : employee.Id,versionNumber : employee.VersionNumber);
        }
    }
}
