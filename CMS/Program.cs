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

// ✅ CORS Configuration (for cross-origin cookie usage)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "https://cms-web-2xtg.onrender.com",
                "https://amhara-cms.netlify.app",
                "http://localhost:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();

        // ✅ Ensure correct preflight response even for older browsers
        policy.SetIsOriginAllowed(origin =>
            new[]
            {
                "https://cms-web-2xtg.onrender.com",
                "https://amhara-cms.netlify.app",
                "http://localhost:3000"
            }.Contains(origin));
    });
});


// 🔧 Controller settings
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

builder.Services
    .AddEndpointsApiExplorer()
    .AddSwagger()
    .AddApplicationServices()
    .AddInfrastructureService()
    .AddPersistenceService(builder.Configuration)
    .AddScoped<HttpContextAccessor>();

var app = builder.Build();

// ✅ Add Cookie Policy middleware (REQUIRED for cookie settings to apply)
app.UseCookiePolicy(); // 🔥 Required for cookie-based auth across domains

// Swagger & Data Seeding
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    await DataSeeder.SeedData(app);
}

// ✅ CORS must be before Authentication
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
