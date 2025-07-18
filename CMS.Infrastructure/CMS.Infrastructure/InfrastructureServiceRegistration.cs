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

            services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.Name = "auth";
                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Ensure Secure (HTTPS)
                options.Cookie.SameSite = SameSiteMode.None;             // Allow cross-site
                options.Cookie.Domain = null;                            // Don't hardcode unless needed

                options.ExpireTimeSpan = TimeSpan.FromHours(8);
                options.SlidingExpiration = true;

                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                };

                options.Events.OnRedirectToAccessDenied = context =>
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return Task.CompletedTask;
                };
            });

            services.AddAuthorization(options =>
            {
                AddDynamicAuthorizationPolicies(options, services).GetAwaiter().GetResult();
            });

            return services;
        }

        public static async Task AddDynamicAuthorizationPolicies(AuthorizationOptions options, IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<HRRole>>();
            var context = serviceProvider.GetRequiredService<CMSDBContext>();

            var roles = await roleManager.Roles.ToListAsync();
            foreach (var role in roles)
            {
                var roleClaims = await roleManager.GetClaimsAsync(role);
                foreach (var claim in roleClaims)
                {
                    var policyName = claim.Value;
                    options.AddPolicy(policyName, policy =>
                    {
                        policy.RequireClaim(claim.Type, claim.Value);
                    });
                }
            }
        }
    }
}
