using AutoMapper;
using CMS.Application;
using CMS.ApplicationLayer.UserAccount;
using CMS.Domain.User;
using CMS.Persistence;
using CMS.Persistence.Repositories;
using CMS.Service.ValueConverterService;
using CMS.Services.DataService;
using CMS.Services.EmailService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SMS.Persistence.Interceptors;

namespace CMS.Persistance.DBContext
{
    public static class PersistanceDBConnection
    {
        public static IServiceCollection AddPersistenceService(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<PublishDomainEventsInterceptor>();
            services.AddScoped<AuditableEntitySaveChangesInterceptor>();

            services.AddDbContext<CMSDBContext>(item => item.UseNpgsql(configuration.GetConnectionString("CMSConnectionString")));
            //services.AddDbContext<CMSDBContext>(item => item.UseSqlServer(configuration.GetConnectionString("CMSConnectionString")));
            services.AddScoped<IDataService, CMSDBContext>();
            services.AddScoped<IExchangeEmail, Exchange>();
        

            services.AddScoped<IUserRepository, UserRepository>();
            //services.AddScoped<IUserAccount, UserAccountRegister>();
            services.AddControllersWithViews();
            services.AddScoped<IValueConvertor, ValueConvertor>();
            return services;
        }
    }
}
