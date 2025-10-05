using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.EmployeeWarning.Commands.UpdateEmployeeWarning
{
    public class UpdateEmployeeWarningCommand : IRequest<int>
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public double Percentage { get; set; }
        public DateOnly WarningDate { get; set; }
        public WarningStatus WarningStatus { get; set; }
        public ViolationType ViolationType { get; set; }
        public string? Remark { get; set; }
    }
    public class UpdateEmployeeWarningCommandHandler : IRequestHandler<UpdateEmployeeWarningCommand, int>
    {
        private readonly IDataService dataService;
        public UpdateEmployeeWarningCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(UpdateEmployeeWarningCommand command, CancellationToken cancellationToken)
        {
            var warning = await dataService.EmployeeWarnings.FindAsync(command.Id);
            warning.EmployeeId = command.EmployeeId;
            warning.Percentage = command.Percentage;
            warning.WarningDate = command.WarningDate;
            warning.WarningStatus = command.WarningStatus;
            warning.ViolationType = command.ViolationType;
            warning.ApprovalStatus = ApprovalStatus.Draft;
            await dataService.SaveAsync(cancellationToken);
            return warning.Id;
        }
    }
}
