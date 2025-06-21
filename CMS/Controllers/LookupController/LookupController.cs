using CMS.API.Dto;
using CMS.Application.Features.BusinessUnits;
using CMS.Application.Features.BusinessUnits.Queries;
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

            var businessUnits= await mediator.Send(new GetBusinessUnitsQuery());
            var businessUnitTypes = await mediator.Send(new GetBusinessUnitTypeQuery());
            
            return new LookupDto
            {
                BusinessUnits= businessUnits,
                BusinessUnitTypes= businessUnitTypes,

            };
        }
    }
}
