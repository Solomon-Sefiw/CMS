using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeActivities.Acting.Commands.CreateActingAssignment
{
    public class CreateActingCommand : IRequest<int>
    {
        public int EmployeeId { get; set; }
        public int JobRoleId { get; set; }
        public int? BusinessUnitId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
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
                BusinessUnitId = request.BusinessUnitId,
                StartDate = request.StartDate,
                EndDate = request.EndDate
            };

            dataService.Actings.Add(acting);
            await dataService.SaveAsync(cancellationToken);

            return acting.Id;

        }
    }
}
