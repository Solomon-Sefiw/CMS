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


builder.Services.AddProblemDetails(config =>
{
});

builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
}).AddJsonOptions(options =>
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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger()
        .UseSwaggerUI();
    await DataSeeder.SeedData(app);
}

app.UseAuthentication();
app.UseAuthorization();


//app.UseHttpsRedirection();
app.MapControllers();


app.Run();
