using CMS.Domain.User;
using CMS.Persistance.DBContext;
using CMS.Persistance.SeedData;
using Microsoft.AspNetCore.Identity;

namespace CMS.Api
{
    public static class DataSeeder
    {
        public static async Task<WebApplication> SeedData(WebApplication app)
        {
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                using (var context = scope.ServiceProvider.GetRequiredService<CMSDBContext>())
                {
                    try
                    {
                        var userManager = services.GetRequiredService<UserManager<HRUser>>();
                        var roleManager = services.GetRequiredService<RoleManager<HRRole>>();
                        await Seed.SeedData(context, userManager,roleManager);
                    }
                    catch (Exception ex)
                    {
                        var logger = services.GetRequiredService<ILogger<CMSDBContext>>();
                        logger.LogError(ex, "Error occurred  during migration");
                        throw;
                    }
                }
            }
            return app;
        }
    }
}