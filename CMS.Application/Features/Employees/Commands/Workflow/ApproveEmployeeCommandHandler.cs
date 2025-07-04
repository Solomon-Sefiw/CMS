using CMS.Common;
using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application;

public record ApproveEmployeeCommand(int Id, string Note) : IRequest;

public class ApproveEmployeeCommandHandler : IRequestHandler<ApproveEmployeeCommand>
{
    private readonly IDataService dataService;
    private readonly IUserService userService;
    private readonly IMediator mediator;
    public ApproveEmployeeCommandHandler(
        IDataService dataService,
        IUserService userService,
        IMediator mediator)
    {
        this.dataService = dataService;
        this.userService = userService;
        this.mediator = mediator;
    }
    public async Task Handle(ApproveEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employee = await dataService.Employees.FirstOrDefaultAsync(x => x.Id == request.Id);

        if (employee != null)
        {
            employee.ApprovalStatus = ApprovalStatus.Approved;
            employee.EmployeeStatus = Domain.Enums.EmployeeStatusEnum.UnderProbation;
            //Approve related entities
            // await ApproveContactChanges(request);
            await dataService.SaveAsync(cancellationToken);
            await mediator.Send(new AddEmployeeCommentCommand(request.Id, CommentType.Approval, request.Note));

        }
    }
   


}