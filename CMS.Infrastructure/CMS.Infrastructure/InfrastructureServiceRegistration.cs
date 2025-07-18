using CMS.Application;
using CMS.Application.Contrats;
using CMS.Application.Security;
using CMS.Domain.User;
using CMS.Infrastructure.Identity;
using CMS.Persistance.DBContext;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CMS.Infrastructure
{
    public static class InfrastructureServiceRegistration
    {
        public static IServiceCollection AddInfrastructureService(this IServiceCollection services)
        {
            // 🔧 Application services
            services.AddScoped<IDocumentUploadService, DocumentUploadService>();
            services.AddTransient<IIdentityService, IdentityService>();

            // 👤 Identity setup
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

            // 🍪 Cookie config for cross-site & secure setup
            services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.Name = "auth";
                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.Domain = null; // set if needed explicitly

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

            // 🔐 Dynamic policy registration
            services.AddAuthorization(options =>
            {
                AddDynamicAuthorizationPolicies(options, services).GetAwaiter().GetResult();
            });

            return services;
        }

        private static async Task AddDynamicAuthorizationPolicies(AuthorizationOptions options, IServiceCollection services)
        {
            using var provider = services.BuildServiceProvider();
            var roleManager = provider.GetRequiredService<RoleManager<HRRole>>();
            var context = provider.GetRequiredService<CMSDBContext>();

            var roles = await roleManager.Roles.ToListAsync();
            foreach (var role in roles)
            {
                var claims = await roleManager.GetClaimsAsync(role);
                foreach (var claim in claims)
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
