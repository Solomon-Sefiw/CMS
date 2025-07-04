using CMS.Common;
using CMS.Domain;
using CMS.Domain.Employee;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application;

public record AddEmployeeCommentCommand(int Id, CommentType CommentType, string Text) : IRequest;

internal class AddEmployeeCommentCommandHandler : IRequestHandler<AddEmployeeCommentCommand>
{
    private readonly IDataService dataService;
    private readonly IUserService userService;

    public AddEmployeeCommentCommandHandler(IDataService dataService, IUserService userService)
    {
        this.dataService = dataService;
        this.userService = userService;
    }
    public async Task Handle(AddEmployeeCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = new EmployeeComment
        {
            CommentType = request.CommentType.ToString(),
            Text = request.Text,
            Date = DateTime.Now,
            CommentedByUserId = "1",//userService.GetCurrentUserId(),
            CommentedBy = "Tse",//userService.GetCurrentUserFullName(),
            EmployeeId = request.Id
        };
        dataService.EmployeeComments.Add(comment);

        await dataService.SaveAsync(cancellationToken);
    }
}
