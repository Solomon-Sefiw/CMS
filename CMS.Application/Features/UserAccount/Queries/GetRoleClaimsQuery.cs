using AutoMapper;
using CMS.Application.Features.User.Queries;
using CMS.Application.Models;
using CMS.Domain.User;
using CMS.Services.DataService;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.UserAccount.Queries
{
    public class GetRoleClaimsQuery : IRequest<List<RoleWithClaimsDto>>
    {
    }

    public class GetRoleClaimsQueryHandler : IRequestHandler<GetRoleClaimsQuery, List<RoleWithClaimsDto>>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;
        private readonly RoleManager<HRRole> roleManager;
        public GetRoleClaimsQueryHandler(IDataService dataService, IMapper mapper,RoleManager<HRRole> roleManager)
        {
            this.dataService = dataService;
            this.mapper = mapper;
            this.roleManager = roleManager;
        }
        public async Task<List<RoleWithClaimsDto>> Handle(GetRoleClaimsQuery request, CancellationToken cancellationToken)
        {
            //var roles = await dataService.Roles.ToListAsync();
            //return mapper.Map<List<RoleWithClaimsDto>>(roles);
            var roles = await roleManager.Roles.ToListAsync();

            var roleClaimsQuery = new List<RoleWithClaimsDto>();

            // Iterate over each role and get its claims
            foreach (var role in roles)
            {
                // Get claims for the current role
                var claims = await roleManager.GetClaimsAsync(role);

                var roleWithClaims = new RoleWithClaimsDto
                {
                    RoleId = role.Id,
                    RoleName = role.Name,
                    Claims = claims.Select(c => new Claim
                    {
                        ClaimType = c.Type,
                        ClaimValue = c.Value,
                    }).ToList()
                };

                roleClaimsQuery.Add(roleWithClaims);
            }

            return roleClaimsQuery;
        }
    }

    
}
