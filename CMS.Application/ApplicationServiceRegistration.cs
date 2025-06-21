using FluentValidation;
using CMS.Domain;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using CMS.Application.PipelineBehaviors;
using SMS.Application.PipelineBehaviors;
using CMS.Application.Features.Documents.Commands;
using CMS.Application.Features.BusinessUnits.Services;

namespace CMS.Application;

public static class ApplicationServiceRegistration
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        services.AddValidatorsFromAssembly(typeof(IDomainEvent).Assembly);
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddMediatR(config =>
        {
            config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehavior<,>));
            config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(UnhandledExceptionBehavior<,>));
            config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

            config.RegisterServicesFromAssembly(typeof(AddDocumentCommand).Assembly);
        });
        services.AddScoped<IGenerateBusinessUnitCodeService, GenerateBusinessUnitCodeService>();
        return services;
    }
}