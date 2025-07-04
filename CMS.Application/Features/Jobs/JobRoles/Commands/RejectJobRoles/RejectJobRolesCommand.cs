using MediatR;

namespace CMS.Application.Features.Job.JobRoles.Commands.RejectJobRoles
{
    public class RejectJobRolesCommand : IRequest<int>
    {
        public int Id { get; set; }
        public string comment { get; set; }
    }
}
