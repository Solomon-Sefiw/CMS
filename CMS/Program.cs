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

// CORS must support credentials
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "https://cms-web-2xtg.onrender.com",
                "http://localhost:3000",
                "https://amhara-cms.netlify.app")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // ✅ Allow sending cookies from frontend
    });
});

// Controllers and filters
builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services.AddScoped<ApiExceptionFilterAttribute>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddHttpClient();

// Service Registrations
builder.Services
    .AddEndpointsApiExplorer()
    .AddSwagger()
    .AddApplicationServices()
    .AddInfrastructureService()
    .AddPersistenceService(builder.Configuration)
    .AddScoped<HttpContextAccessor>();

var app = builder.Build();

// Swagger + optional data seeding
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    await DataSeeder.SeedData(app);
}

// CORS before auth!
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

//app.UseHttpsRedirection();

app.MapControllers();
app.Run();
