using MediatR;

namespace CMS.Application.Features.Jobs.JobRoles.Commands.SubmitJobRoles
{
    public class SubmitJobRolesCommand:IRequest<int>
    {
        public int Id { get; set; }
        public string comment { get; set; }
    }
}
