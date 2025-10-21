using CMS.Common;
using CMS.Domain;
using CMS.Domain.Employee;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application;

public record AddCaseCommentCommand(int Id, CommentType CommentType, string Text) : IRequest;

internal class AddCaseCommentCommandHandler : IRequestHandler<AddCaseCommentCommand>
{
    private readonly IDataService dataService;
    private readonly IUserService userService;

    public AddCaseCommentCommandHandler(IDataService dataService, IUserService userService)
    {
        this.dataService = dataService;
        this.userService = userService;
    }
    public async Task Handle(AddCaseCommentCommand request, CancellationToken cancellationToken)
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
