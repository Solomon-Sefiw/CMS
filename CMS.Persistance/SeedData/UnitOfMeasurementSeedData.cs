using CMS.Domain.Benefit;
using CMS.Domain.Education;
using CMS.Persistance.DBContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Persistance.SeedData
{
    public class UnitOfMeasurementSeedData
    {
        public static async Task SeedAsync(CMSDBContext context)
        {
            if (context.BenefitUnitOfMeasurements.Any()) return;
            var unitOfMeasurements = new List<BenefitUnitOfMeasurement>()
            {

            new BenefitUnitOfMeasurement { Name = "ETB",IsUnitPriced = false,Description = "Allowance In Ethiopian Birr" },
            new BenefitUnitOfMeasurement { Name = "Liter",IsUnitPriced = true,Description="Fuel Allowance In Liter " },
            };

            await context.BenefitUnitOfMeasurements.AddRangeAsync(unitOfMeasurements);
        }
    }
}
