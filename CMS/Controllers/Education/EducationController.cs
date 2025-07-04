using CMS.API.Attributes;
using CMS.Application.Features.Educations.Commands.CreateEducation;
using CMS.Application.Features.Educations.Commands.UpdateEducation;
using CMS.Application.Features.Educations.Queries.GetEducationById;
using CMS.Application.Features.Educations.Queries.ListEducationsByEmployee;
using CMS.Application.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.API.Controllers.Education
{
    [Route("api/[controller]")]
    [ApiController]
    public class EducationController : BaseController<EducationController>
    {


        [HttpPost("create", Name = "AddEducation")]
        [InvalidateQueryTags("EmployeeProfile")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canCreateUpdateEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> CreateEducation([FromBody] CreateEducationCommand command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpGet("GetEducationById")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<EducationDto>>> GetEducationById( int employeeId)
        {
            return Ok(await mediator.Send(new GetEducationByIdQuery(employeeId)));
        }
        [HttpPut("update", Name = "UpdateEducation")]
        [InvalidateQueryTags("EmployeeProfile")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        public async Task<ActionResult<int>> UpdateEducation(UpdateEducationCommand command)
        {
            return Ok(await mediator.Send(command));
        }
    }
}
