using MediatR;

namespace CMS.Application.Features.Job.JobRoles.Commands.ApproveJobRole
{
    public class ApproveJobRolesCommand: IRequest<int>
    {
        public int Id { get; set; }
        public string comment { get; set; }
    }
}
