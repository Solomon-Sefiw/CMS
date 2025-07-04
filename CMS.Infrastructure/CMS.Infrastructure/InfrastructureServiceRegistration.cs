using CMS.Application;
using CMS.Application.Contrats;
using CMS.Application.Security;
using CMS.Domain.User;
using CMS.Infrastructure.Identity;
using CMS.Persistance.DBContext;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace CMS.Infrastructure
{
    public static class InfrastructureServiceRegistration
    {
        public static IServiceCollection AddInfrastructureService(this IServiceCollection services)
        {
            services.AddScoped<IDocumentUploadService, DocumentUploadService>();
            services.AddTransient<IIdentityService, IdentityService>();

            _ = services.AddIdentity<HRUser, HRRole>(options =>
            {
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 8;
                options.User.RequireUniqueEmail = true;

                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(2);
                options.Lockout.MaxFailedAccessAttempts = 5;
            })
            .AddRoles<HRRole>()
            .AddEntityFrameworkStores<CMSDBContext>()
            .AddDefaultTokenProviders();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
            {
                options.Cookie.Name = "auth";
                options.Cookie.SameSite = SameSiteMode.Strict;
                options.Events.OnRedirectToLogin = (context) =>
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                };

                options.Events.OnRedirectToAccessDenied = (context) =>
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return Task.CompletedTask;
                };
                options.ExpireTimeSpan = TimeSpan.FromHours(8);
            });

            // Dynamically add authorization policies
            services.AddAuthorization(options =>
            {
                AddDynamicAuthorizationPolicies(options, services).GetAwaiter().GetResult();
            });

            //services.AddAuthorization(options =>
            //{
            //    options.AddPolicy(AuthPolicy.canCreateUpdateEmployeePersonalInfo, policy => policy.RequireRole(Roles.HROfficer));
            //    options.AddPolicy(AuthPolicy.canSubmitEmployeePersonalInfo, policy => policy.RequireRole(Roles.HROfficer));
            //    options.AddPolicy(AuthPolicy.canApproveRejectEmployeePersonalInfo, policy => policy.RequireRole(Roles.HRSectionHead, Roles.HRAdmin));
            //    options.AddPolicy(AuthPolicy.canCreateUpdateUser, policy => policy.RequireRole(Roles.HRSectionHead, Roles.ITAdmin));
            //    options.AddPolicy(AuthPolicy.canViewUser, policy => policy.RequireRole(Roles.HRSectionHead, Roles.ITAdmin));
            //});



            return services;
        }

        public static async Task AddDynamicAuthorizationPolicies(AuthorizationOptions options, IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<HRRole>>();
            var context = serviceProvider.GetRequiredService<CMSDBContext>();

            var roles = await roleManager.Roles.ToListAsync(); // Fetch all roles

            foreach (var role in roles)
            {
                // Fetch permissions for the role (these will be role claims)
                var roleClaims = await roleManager.GetClaimsAsync(role);

                foreach (var claim in roleClaims)
                {
                    // Dynamically create a policy for each claim (permission)
                    var policyName = claim.Value; // Use the permission (claim value) as the policy name

                    // Add the policy dynamically, associating it with the role
                    options.AddPolicy(policyName, policy =>
                    {
                        //policy.RequireRole(role.Name); // Require that the user has the role to access the resource
                        policy.RequireClaim(claim.Type, claim.Value); // Require that the user has the specific permission (claim)
                    });
                }
            }

            // Optionally log any additional information about the policies being created
            //var logger = serviceProvider.GetRequiredService<ILogger<InfrastructureServiceRegistration>>();
            //logger.LogInformation("Dynamic Authorization Policies have been added successfully.");
        }


       
    }
}
