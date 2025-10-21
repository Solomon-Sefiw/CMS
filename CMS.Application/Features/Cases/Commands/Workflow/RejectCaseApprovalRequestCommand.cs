using CMS.Common;
using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application;


public record RejectCaseApprovalRequestCommand(int Id, string Note) : IRequest;

public class RejectCaseApprovalRequestCommandHandler : IRequestHandler<RejectCaseApprovalRequestCommand>
{
    private readonly IDataService dataService;
    private readonly IUserService userService;
    private readonly IMediator mediator;

    public RejectCaseApprovalRequestCommandHandler(IDataService dataService, IUserService userService, IMediator mediator)
    {
        this.dataService = dataService;
        this.userService = userService;
        this.mediator = mediator;
    }
    public async Task Handle(RejectCaseApprovalRequestCommand request, CancellationToken cancellationToken)
    {
        var Case = await dataService.Cases.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (Case != null)
        {
            Case.ApprovalStatus = ApprovalStatus.Rejected;
            await dataService.SaveAsync(cancellationToken);
            //await mediator.Send(new AddEmployeeCommentCommand(request.Id, CommentType.Rejection, request.Note));
        }
    }
}
