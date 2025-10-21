using CMS.Common;
using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace CMS.Application;

public record ApproveCaseCommand(int Id, string Note) : IRequest;

public class ApproveCaseCommandHandler : IRequestHandler<ApproveCaseCommand>
{
    private readonly IDataService dataService;
    private readonly IUserService userService;
    private readonly IMediator mediator;
    public ApproveCaseCommandHandler(
        IDataService dataService,
        IUserService userService,
        IMediator mediator)
    {
        this.dataService = dataService;
        this.userService = userService;
        this.mediator = mediator;
    }
    public async Task Handle(ApproveCaseCommand request, CancellationToken cancellationToken)
    {
        var Case = await dataService.Cases.FirstOrDefaultAsync(x => x.Id == request.Id);

        if (Case != null)
        {
            Case.ApprovalStatus = ApprovalStatus.Approved;
            await dataService.SaveAsync(cancellationToken);
            //await mediator.Send(new AddCaseCommentCommand(request.Id, CommentType.Approval, request.Note));

        }
    }
   


}