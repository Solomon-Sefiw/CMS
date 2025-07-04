using FluentValidation;
using CMS.Application.Features.BusinessUnits.Commands.CreateBusinessUnit;
using CMS.Application.Features.BusinessUnits.Services;
using CMS.Domain;
using CMS.Application.Features.Jobs.Job.Command.CreateJob;
using CMS.Application.Features.Jobs.Job.Command.UpdateJob;
using CMS.Application.Features.Jobs.Job.Services;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using CMS.Application.Features.EmployeeEmergencyContacts.Commands;
using CMS.Application.Features.EmployeeEmergencyContacts.Commands.UpdateEmeregencyContact;
using CMS.Application.Features.Commands.CreateContact;
using CMS.Application.Features.Commands.UpdateContact;
using CMS.Application.PipelineBehaviors;
using SMS.Application.PipelineBehaviors;
using CMS.Application.Features.Service;

namespace CMS.Application;

public static class ApplicationServiceRegistration
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        services.AddValidatorsFromAssembly(typeof(IDomainEvent).Assembly);
        services.AddValidatorsFromAssembly(typeof(CreateBusinessUnitCommand).Assembly);
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddMediatR(config =>
        {
            config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehavior<,>));
            config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(UnhandledExceptionBehavior<,>));
            config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

            config.RegisterServicesFromAssembly(typeof(AddJobCommand).Assembly);
            config.RegisterServicesFromAssembly(typeof(UpdateJobCommand).Assembly);
            config.RegisterServicesFromAssembly(typeof(CreateEmployeeEmergencyContactCommand).Assembly);
            config.RegisterServicesFromAssembly(typeof(UpdateEmployeeEmergencyContactCommand).Assembly);
            config.RegisterServicesFromAssembly(typeof(CreateBusinessUnitCommand).Assembly);
            config.RegisterServicesFromAssembly(typeof(CreateContactCommand).Assembly);
            config.RegisterServicesFromAssembly(typeof(UpdateContactCommand).Assembly);


        });
        services.AddScoped<IGenerateBusinessUnitCodeService, GenerateBusinessUnitCodeService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IEmployeeChangeLogService, EmpoloyeeChangeLogService>();
        return services;
    }
}