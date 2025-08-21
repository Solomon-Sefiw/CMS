using CMS.Application.Features.Employees;
using CMS.Application.Features.Reemployments.Commands;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Application.Features.Reemployments.Handlers
{
    public class ApproveReemploymentCommandHandler
        : IRequestHandler<ApproveReemploymentCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IMediator mediator;
        public ApproveReemploymentCommandHandler(IDataService dataService, IMediator mediator)
        {
            this.dataService = dataService;
            this.mediator = mediator;
        }
        public async Task<int> Handle(ApproveReemploymentCommand request, CancellationToken cancellationToken)
        {
            // Fetch the reemployment 
            var reemployment = await dataService.Reemployments
                .Include(r => r.Employee)
                .FirstOrDefaultAsync(r => r.Id == request.ReemploymentId, cancellationToken);

            if (reemployment == null)
                throw new Exception("Reemployment record not found");

            reemployment.ApprovalStatus = ApprovalStatus.Approved;
            reemployment.Remark = request.Remark;

            switch (reemployment.ReemploymentType)
            {
                case ReemploymentType.Reinstate:
                    reemployment.Employee.EmployeeStatus = EmployeeStatusEnum.Active;
                    reemployment.Employee.SkipStateTransitionCheck = true;
                    await dataService.SaveAsync(cancellationToken);
                    break;

                case ReemploymentType.Rehire:
                    if (request.NewEmployeeProfile == null)
                        throw new Exception("Employee profile data required for rehire.");

                    reemployment.Employee.EmployeeStatus = EmployeeStatusEnum.Reemployed;
                    reemployment.Employee.SkipStateTransitionCheck = true;

                    request.NewEmployeeProfile.PreviousEmployeeId = reemployment.EmployeeId;

                    var newEmployeeExists = await dataService.Employees
                        .AsNoTracking()
                        .AnyAsync(e => e.PreviousEmployeeId == reemployment.EmployeeId, cancellationToken);

                    if (!newEmployeeExists)
                    {
                        await mediator.Send(request.NewEmployeeProfile, cancellationToken);
                    }
                    break;

                default:
                    throw new Exception($"Unsupported reemployment type: {reemployment.ReemploymentType}");
            }

            return reemployment.Id;
        }
    }
}
