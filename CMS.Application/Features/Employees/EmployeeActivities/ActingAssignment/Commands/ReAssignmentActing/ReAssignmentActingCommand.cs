using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Commands.ReAssignmentActing
{
  public class ReAssignmentActingCommand : IRequest<int>
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

    public class ReAssignmentActingCommandHandler : IRequestHandler<ReAssignmentActingCommand, int>
    {
        private readonly IDataService dataService;
        public ReAssignmentActingCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(ReAssignmentActingCommand request, CancellationToken cancellationToken)
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
                ActingType = ActingType.Reassignment,
                ApprovalStatus = ApprovalStatus.Draft,
                IsActive = true,
            };
            dataService.Actings.Add(acting);
            await dataService.SaveAsync(cancellationToken);
            return acting.Id;
        }
    }

}
