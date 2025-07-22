using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Commands.SubmitActing
{

    public record SubmitActingCommand(int Id) : IRequest<int>;

    public class SubmitActingCommandHandler : IRequestHandler<SubmitActingCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitActingCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(SubmitActingCommand command, CancellationToken cancellationToken)
        {
            var delegation = dataService.Actings.Where(r => r.Id == command.Id).FirstOrDefault();

            delegation.ApprovalStatus = ApprovalStatus.Submitted;
            await dataService.SaveAsync(cancellationToken);
            return delegation.Id;
        }
    }
}
