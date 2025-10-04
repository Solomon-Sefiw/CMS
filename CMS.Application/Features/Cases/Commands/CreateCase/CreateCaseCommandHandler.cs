using AutoMapper;
using CMS.Domain.Cases;
using CMS.Domain.Employee;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application.Features.Employees.Commands
{
    public class CreateCaseCommandHandler : IRequestHandler<CreateCaseCommand, CreateCaseReturnType>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataService;
        public CreateCaseCommandHandler(IMapper mapper, IDataService dataService)
        {
            this.mapper = mapper;
            this.dataService = dataService;
        }
        public async Task<CreateCaseReturnType> Handle(CreateCaseCommand request, CancellationToken cancellationToken)
        {

            var employee = mapper.Map<Case>(request);

            dataService.Cases.Add(employee);

            await dataService.SaveAsync(cancellationToken);
            return new CreateCaseReturnType(id : employee.Id,versionNumber : employee.VersionNumber);
        }
    }
}
