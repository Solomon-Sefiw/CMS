using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeActivities.Acting.Commands.CreateActingAssignment
{
    public class CreateActingCommand : IRequest<int>
    {
        public int EmployeeId { get; set; }
        public int JobRoleId { get; set; }
        public int PreviousJobRoleId { get; set; }
        public int? BusinessUnitId { get; set; }
        public int? PreviousBusinessUnitId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public ActingType ActingType { get; set; }
    }

    public class CreateActingCommandHandler : IRequestHandler<CreateActingCommand, int>
    {
        private readonly IDataService dataService;
    public CreateActingCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(CreateActingCommand request, CancellationToken cancellationToken)
        {
            var acting = new Domain.Acting.Acting
            {
                EmployeeId = request.EmployeeId,
                JobRoleId = request.JobRoleId,
                PreviousJobRoleId = request.PreviousJobRoleId,
                BusinessUnitId = request.BusinessUnitId,
                PreviousBusinessUnitId = request.PreviousBusinessUnitId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                ActingType = request.ActingType,
            };
           await dataService.Actings.AddAsync(acting);
            await dataService.SaveAsync(cancellationToken);
            return acting.Id;
        }
    }
}
