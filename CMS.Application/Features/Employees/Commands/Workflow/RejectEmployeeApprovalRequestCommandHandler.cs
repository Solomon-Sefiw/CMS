using CMS.Common;
using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application;


public record RejectEmployeeApprovalRequestCommand(int Id, string Note) : IRequest;

public class RejectEmployeeApprovalRequestCommandHandler : IRequestHandler<RejectEmployeeApprovalRequestCommand>
{
    private readonly IDataService dataService;
    private readonly IUserService userService;
    private readonly IMediator mediator;

    public RejectEmployeeApprovalRequestCommandHandler(IDataService dataService, IUserService userService, IMediator mediator)
    {
        this.dataService = dataService;
        this.userService = userService;
        this.mediator = mediator;
    }
    public async Task Handle(RejectEmployeeApprovalRequestCommand request, CancellationToken cancellationToken)
    {
        var employee = await dataService.Employees.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (employee != null)
        {
            employee.ApprovalStatus = ApprovalStatus.Rejected;
            await dataService.SaveAsync(cancellationToken);
            await mediator.Send(new AddEmployeeCommentCommand(request.Id, CommentType.Rejection, request.Note));
        }
    }
}
