using CMS.Domain.Employee.EmployeeActivities;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.Resignations.Commands.UpdateResignation
{
    public class UpdateResignationCommand : IRequest<int>
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public decimal Salary { get; set; }
        public string WorkUnit { get; set; } = string.Empty;
        public DateOnly ResignationDate { get; set; }
        public ResignationType ResignationType { get; set; }
        public string ReasonForResignation { get; set; } = string.Empty;
        public string FinalSettlementDetails { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }

    public class UpdateResignationCommandHandler : IRequestHandler<UpdateResignationCommand, int>
    {
        private readonly IDataService dataService;

        public UpdateResignationCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }

        public async Task<int> Handle(UpdateResignationCommand command, CancellationToken cancellationToken)
        {
            var resignation = await dataService.Resignations.FindAsync(command.Id);
            resignation.EmployeeId = command.EmployeeId;
            resignation.Salary = command.Salary;
            resignation.WorkUnit = command.WorkUnit;
            resignation.ResignationDate = command.ResignationDate;
            resignation.ResignationType = command.ResignationType;
            resignation.ReasonForResignation = command.ReasonForResignation;
            resignation.FinalSettlementDetails = command.FinalSettlementDetails;
            resignation.IsActive = true;
            resignation.ApprovalStatus = ApprovalStatus.Draft;

            await dataService.SaveAsync(cancellationToken);
            return resignation.Id;
        }
    }
}
