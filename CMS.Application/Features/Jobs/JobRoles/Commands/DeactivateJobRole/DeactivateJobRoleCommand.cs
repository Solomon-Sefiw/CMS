using MediatR;

namespace CMS.Application.Features.Job.JobRoles.Commands.DeactivateJobRole
{
    public class DeactivateJobRoleCommand:IRequest<int>
    {
        public int Id { get; set; }
        public string comment { get; set; }
    }
}
