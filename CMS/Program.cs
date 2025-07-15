using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using System.Text.Json.Serialization;
using CMS.API.Configurations;
using CMS.Api.Filters;
using CMS.Api.Services;
using CMS.Api;
using CMS.Common;
using CMS.Application;
using CMS.Infrastructure;
using CMS.Persistance.DBContext;

var builder = WebApplication.CreateBuilder(args);

// 👇 Enable cookie configuration for Identity
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None; // ✅ Needed for cross-site cookies
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // ✅ Must be Secure for SameSite=None
    options.LoginPath = "/api/Account/login";
    options.AccessDeniedPath = "/access-denied";
});

builder.Services.AddProblemDetails(config =>
{
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "https://cms-web-2xtg.onrender.com",  // ✅ your deployed frontend
            "http://localhost:3000"               // ✅ your dev frontend
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials(); // ✅ Critical: allow cookies to be sent
    });
});

// 👇 Add session support (optional but improves state handling)
builder.Services.AddSession();

builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services.AddScoped<ApiExceptionFilterAttribute>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddHttpClient();

builder.Services.AddEndpointsApiExplorer()
    .AddSwagger()
    .AddApplicationServices()
    .AddInfrastructureService()
    .AddPersistenceService(builder.Configuration)
    .AddScoped<HttpContextAccessor>();

var app = builder.Build();

// ✅ Enable Swagger & Seeding in both Dev & Production
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    await DataSeeder.SeedData(app); // Optional
}

// ⚠️ Order matters here!
app.UseCors("AllowFrontend");

app.UseSession(); // ✅ Needed if using session-based identity
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
