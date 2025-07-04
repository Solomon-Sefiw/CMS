using CMS.Api.Controllers;
using CMS.API.Dto;
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Queries;
using CMS.Application.Features.Benefits.Queries;
using CMS.Application.Features.BranchGrades.Queries;
using CMS.Application.Features.BusinessUnits;
using CMS.Application.Features.BusinessUnits.Queries;
using CMS.Application.Features.Jobs.JobCatagories;
using CMS.Application.Features.Jobs.JobGrades;
using CMS.Application.Features.Jobs.JobRoleCatagories.Queries;
using CMS.Application.Features.Jobs.JobRoles.Queries;
using Microsoft.AspNetCore.Mvc;

namespace CMS.API.Controllers.LookupController
{
    [Route("api/[controller]")]
    [ApiController]
    public class LookupController:BaseController<LookupController>
    {
 
        [HttpGet("all")]
        public async Task<LookupDto> GetAllLookups()
        {
            var jobRoles= await mediator.Send(new GetJobRoleQuery());
            var jobGrades= await mediator.Send(new GetJobGradeQuery());
            var businessUnits= await mediator.Send(new GetBusinessUnitsQuery());
            var businessUnitTypes = await mediator.Send(new GetBusinessUnitTypeQuery());
            var jobRoleCatagories = await mediator.Send(new GetJobRoleCatagoriesQuery());
            var branchGrades = await mediator.Send(new GetAllBranchGradeQuery());
            var jobRoleBenefits = await mediator.Send(new GetAllBenefitsQuery());
            var allUnitPricedBenefits = await mediator.Send(new GetAllUnitPricedBenefitQuery());
            var measurementUnits = await mediator.Send(new GetAllBenefitUnitOfMeasurementQuery());
            
            return new LookupDto
            {
                JobGrades= jobGrades,
                BusinessUnits= businessUnits,
                BusinessUnitTypes= businessUnitTypes,
                JobRoles = jobRoles,
                JobRoleCategories = jobRoleCatagories,
                BranchGrades = branchGrades,
                Benefits= jobRoleBenefits,
                UnitPricedBenefits = allUnitPricedBenefits,
                BenefitUnitOfMeasurements = measurementUnits,
            };
        }
    }
}
