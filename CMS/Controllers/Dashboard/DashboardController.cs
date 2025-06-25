using CMS.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using CMS.Application.Features.Letter.Queries;
using CMS.Application.Features.Letter.Models;
using CMS.Application.Security;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Api.Controllers.Dashboard
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : BaseController<DashboardController>
    {
        [HttpGet("count", Name = "GetLetterCountPerStatusForDashboard")]
        [Authorize(Policy = AuthPolicy.Dashboard.canViewLetterCountBoard)]
        [ProducesResponseType(200)]
        public async Task<LetterCountsByStatus> GetLetterCountPerStatusForDashboard()
        {
            return await mediator.Send(new GetLetterCountPerStatusQuery());
        }
        [HttpGet("search-all")]
        [Authorize(Policy = AuthPolicy.Dashboard.canViewRecentLettersBoard)]
        public async Task<ActionResult<List<LetterDto>>> SearchAllLettersForDashboard()
        {
            var query = new SearchLettersQuery();
            var result = await mediator.Send(query);
            return Ok(result);
        }


    }
}
