using CMS.Application.Features.User.Queries;
using CMS.Application.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.UserAccount.Queries
{
    public record GetRoleDetailQuery(string Id) : IRequest<RoleDetail>;

    internal class GetRoleDetailQueryHandler : IRequestHandler<GetRoleDetailQuery, RoleDetail>
    {
        private readonly IUserRepository userRepository;

        public GetRoleDetailQueryHandler(IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }
        public async Task<RoleDetail> Handle(GetRoleDetailQuery request, CancellationToken cancellationToken)
        {
            return await userRepository.GetRoleById(request.Id);
        }
    }
}