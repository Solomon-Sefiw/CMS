using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Commands.CreateSuspension
{
    public class CreateSuspensionCommand : IRequest<int>
    {
        public int EmployeeId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public decimal Salary { get; set; }
        public SuspensionReason Reason { get; set; }
        public string Description { get; set; } = string.Empty;
        public string ConditionsForReinstatement { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }

    public class CreateSuspensionCommandHandler : IRequestHandler<CreateSuspensionCommand, int>
    {
        private readonly IDataService dataService;

        public CreateSuspensionCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(CreateSuspensionCommand request, CancellationToken cancellationToken)
        {
            var suspension = new Domain.Employee.EmployeeActivities.Suspension
            {
                EmployeeId = request.EmployeeId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Salary = request.Salary,
                Reason = request.Reason,
                Description = request.Description,
                ConditionsForReinstatement = request.ConditionsForReinstatement,
                IsActive = request.IsActive
            };

            dataService.Suspensions.Add(suspension);
            await dataService.SaveAsync(cancellationToken);

            return suspension.Id;
        }
    }
}
