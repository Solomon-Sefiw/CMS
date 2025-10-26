using CMS.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using CMS.Application.Features.Letter.Queries;
using CMS.Application.Security;
using Microsoft.AspNetCore.Authorization;
using CMS.Application.Features.Dashboard.AnalyticsQueries;
using CMS.Application.Features.Dashboard.ApprovalQueries;

namespace CMS.Api.Controllers.Dashboard
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : BaseController<DashboardController>
    {
        [HttpGet("count", Name = "GetLetterCountPerStatusForDashboard")]
       [Authorize(Policy = AuthPolicy.Dashboard.canViewLetterCountBoard)]
        [ProducesResponseType(200)]
        public async Task<LetterCountsByStatus> GetLetterCountPerStatusForDashboard(string userId)
        {
            return await mediator.Send(new GetLetterCountPerStatusQuery(userId));
        }
        [HttpGet("search-all")]
        [Authorize(Policy = AuthPolicy.Dashboard.canViewRecentLettersBoard)]
        public async Task<ActionResult<List<LetterDto>>> SearchAllLettersForDashboard(string userId)
        {
            var query = new SearchLettersQuery(userId);
            var result = await mediator.Send(query);
            return Ok(result);
        }


        [ProducesResponseType(200)]
        [HttpGet("GetApprovedActiveEmployeeCount", Name = "GetApprovedActiveEmployeeCount")]
        public async Task<IActionResult> GetApprovedActiveEmployeeCount()
        {
            var result = await mediator.Send(new GetApprovedActiveEmployeeCountQuery());
            return Ok(result);
        }

        [ProducesResponseType(200)]
        [HttpGet("GetApprovedActiveBusinessCount", Name = "GetApprovedActiveBusinessCount")]
        public async Task<IActionResult> GetApprovedActiveBusinessCount()
        {
            var result = await mediator.Send(new GetApprovedActiveBusinessUnitCountQuery());
            return Ok(result);
        }

        [ProducesResponseType(200)]
        [HttpGet("GetEmployeeTurnoverRate", Name = "GetEmployeeTurnoverRate")]
        public async Task<IActionResult> GetEmployeeTurnoverRate()
        {
            var result = await mediator.Send(new GetEmployeeTurnoverRateQuery());

            return Ok(result);
        }

        [ProducesResponseType(200)]
        [HttpGet("GetApprovedActiveJobRoleCount", Name = "GetApprovedActiveJobRoleCount")]
        public async Task<IActionResult> GetApprovedActiveJobRoleCount()
        {
            var result = await mediator.Send(new GetApprovedActiveJobRoleCountQuery());

            return Ok(result);
        }

        [ProducesResponseType(200)]
        [HttpGet("GetEmployeeJobCategoryGroupCount", Name = "GetEmployeeJobCategoryGroupCount")]
        public async Task<IActionResult> GetEmployeeJobCategoryGroupCount()
        {
            var result = await mediator.Send(new GetEmployeeJobCategoryGroupCountQuery());

            return Ok(result);
        }

        //[ProducesResponseType(200)]
        //[HttpGet("GetEmployeeChiefGroupCount", Name = "GetEmployeeChiefGroupCount")]
        //public async Task<IActionResult> GetEmployeeChiefGroupCount()
        //{
        //    var result = await mediator.Send(new GetEmployeeChiefGroupCountQuery());

        //    return Ok(result);
        //}

        [ProducesResponseType(200)]
        [HttpGet("GetEmployeeRetentionRate", Name = "GetEmployeeRetentionRate")]
        public async Task<IActionResult> GetEmployeeRetentionRate()
        {
            var result = await mediator.Send(new GetEmployeeRetentionRateQuery());

            return Ok(result);
        }

        [ProducesResponseType(200)]
        [HttpGet("GetNewEmployeesThisYear", Name = "GetNewEmployeesThisYear")]
        public async Task<IActionResult> GetNewEmployeesThisYear()
        {
            var result = await mediator.Send(new GetNewEmployeesThisYearQuery());

            return Ok(result);
        }

        [ProducesResponseType(200)]
        [HttpGet("GetResignedEmployeesThisYear", Name = "GetResignedEmployeesThisYear")]
        public async Task<IActionResult> GetResignedEmployeesThisYear()
        {
            var result = await mediator.Send(new GetResignedEmployeesThisYearQuery());

            return Ok(result);
        }

        [ProducesResponseType(200)]
        [HttpGet("GetVacantJobsCount", Name = "GetVacantJobsCount")]
        public async Task<IActionResult> GetVacantJobsCount()
        {
            var result = await mediator.Send(new GetVacantJobsCountQuery());

            return Ok(result);
        }

        [ProducesResponseType(200)]
        [HttpGet("GetEmployeeDistributionByStatus", Name = "GetEmployeeDistributionByStatus")]
        public async Task<IActionResult> GetEmployeeDistributionByStatus()
        {
            var result = await mediator.Send(new GetEmployeeDistributionByStatusQuery());

            return Ok(result);
        }

        [ProducesResponseType(200)]
        [HttpGet("GetMonthlyEmployeeCount", Name = "GetMonthlyEmployeeCount")]
        public async Task<IActionResult> GetMonthlyEmployeeCount()
        {
            var result = await mediator.Send(new GetMonthlyEmployeeCountQuery());

            return Ok(result);
        }

        [ProducesResponseType(200)]
        [HttpGet("GetApprovalStatusSummary", Name = "GetApprovalStatusSummary")]
        public async Task<IActionResult> GetApprovalStatusSummary()
        {
            var result = await mediator.Send(new GetApprovalStatusSummaryQuery());

            return Ok(result);
        }

        [ProducesResponseType(200)]
        [HttpGet("GetAllApprovalItemsList", Name = "GetAllApprovalItemsList")]
        public async Task<IActionResult> GetAllApprovalItemsList([FromQuery] int pageNumber, [FromQuery] int pageSize)
        {
            var result = await mediator.Send(new GetAllApprovalItemsQuery(pageNumber, pageSize));
            return Ok(result);
        }
    }
}
