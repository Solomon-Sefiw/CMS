using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeActivities.EmployeeWarning.Commands.CreateEmployeeWarning
{
    public class CreateEmployeeWarningCommand : IRequest<int>
    {
        public int EmployeeId { get; set; }
        public double Percentage { get; set; }
        public DateOnly WarningDate { get; set; }
        public ViolationType ViolationType { get; set; }
        public WarningStatus WarningStatus { get; set; }
        public string? Remark { get; set; }
    }

    public class CreateEmployeeWarningCommandHandler : IRequestHandler<CreateEmployeeWarningCommand, int>
    {
        private readonly IDataService dataService;

        public CreateEmployeeWarningCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(CreateEmployeeWarningCommand request, CancellationToken cancellationToken)
        {
            var warning = new Domain.Employee.EmployeeActivities.EmployeeWarning
            {
                EmployeeId = request.EmployeeId,
                Percentage = request.Percentage,
                WarningDate = request.WarningDate,
                ViolationType = request.ViolationType,
                WarningStatus = request.WarningStatus,
                Remark = request.Remark
            };

            dataService.EmployeeWarnings.Add(warning);
            await dataService.SaveAsync(cancellationToken);

            return warning.Id;
        }
    }

}
