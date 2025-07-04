using MediatR;

namespace CMS.Application.Features.Jobs.JobRoles.Commands.ActivateJobRole
{
    public class ActivateJobRoleCommand : IRequest<int>
    {
        public int Id { get; set; }
        public string comment { get; set; }
    }
}
