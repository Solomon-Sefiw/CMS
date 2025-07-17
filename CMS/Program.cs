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
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddProblemDetails(config =>
{
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://cms-web-2xtg.onrender.com")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
}).AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.IsEssential = true;
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

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger()
        .UseSwaggerUI();

    // DataSeeder should be handled carefully in production.
    // Consider running it as a separate deployment step or migration if truly needed.
    // await DataSeeder.SeedData(app); 
}

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();