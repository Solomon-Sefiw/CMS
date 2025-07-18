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
using Microsoft.AspNetCore.Http; // Added for SameSiteMode
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Authentication.Cookies; // Added for forwarded headers

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

builder.Services.AddProblemDetails();

// Enhanced CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://cms-web-2xtg.onrender.com", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetPreflightMaxAge(TimeSpan.FromHours(1));
    });
});

// Configure cookie settings for production
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromHours(12);
    options.SlidingExpiration = true;
});

builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
}).AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// Authentication configuration
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.SameSite = SameSiteMode.None;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
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

// Configure the HTTP request pipeline
app.UseForwardedHeaders();

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger()
       .UseSwaggerUI();

    await DataSeeder.SeedData(app);
}

app.UseRouting();
app.UseCors("AllowFrontend");

// Important: These must be in this exact order
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();