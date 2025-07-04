using CMS.Application.Features.Employees.Family.Commands;
using CMS.Application.Features.Employees.Family.Model;
using CMS.Application.Features.Employees.Family.Queries;
using CMS.Application.Features.Employees.Experience.Commands;
using CMS.Application.Features.Employees.Experience.Model;
using CMS.Application.Features.Employees.Experience.Queries;
using CMS.Application.Features.Employees.Guranters.Commands;
using CMS.Domain.Employee;
using Microsoft.AspNetCore.Mvc; 
using CMS.Application.Features.Employees.Guranters.Queries;
using Microsoft.AspNetCore.Authorization;
using CMS.Application.Security;
using CMS.API.Attributes;

namespace CMS.API.Controllers.EmployeeController
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeFamilyController : BaseController<EmployeeFamilyController>
    {

        [InvalidateQueryTags("EmployeeProfile")]
        [HttpPost("AddEmployeeFamily", Name = "AddEmployeeFamily")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canCreateUpdateEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> AddEmployeeChildren([FromBody] AddEmployeeFamilyCommand command)
        {
            var ChildId = await mediator.Send(command);
            return Ok(ChildId);
        }
        //

        [HttpGet("GetEmployeeExperienceById", Name = "GetEmployeeExperienceById")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<List<EmployeeExperienceDto>>> GetEmployeeExperienceById(int id)
        {
            var employeeExperiences = await mediator.Send(new GetEmployeeExperienceByIdQuery(id));
            return Ok(employeeExperiences);
        }

        [HttpGet("GetEmployeeExperienceListOfEmployee", Name = "GetEmployeeExperienceListOfEmployee")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]

        public async Task<ActionResult<List<EmployeeExperienceDto>>> GetEmployeeExperienceListOfEmployee(int EmployeeId)
        {
            var employeeExperiences = await mediator.Send(new GetEmployeeExperienceListOfEmployeeQuery(EmployeeId));
            return Ok(employeeExperiences);
        }
        [HttpPut("UpdateEmployeeExperience", Name = "UpdateEmployeeExperience")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canCreateUpdateEmployeePersonalInfo)]
        public async Task<ActionResult<int>> UpdateEmployeeExperience([FromBody] UpdateEmployeeExperienceCommand command)
        {
            var expereinceId = await mediator.Send(command);
            return Ok(expereinceId);
        }
        [HttpPost("AddEmployeeExperience", Name = "AddEmployeeExperience")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canCreateUpdateEmployeePersonalInfo)]
        public async Task<ActionResult<int>> AddEmployeeExperience([FromBody] AddEmployeeExperienceCommand command)
        {
            var expereinceId = await mediator.Send(command);
            return Ok(expereinceId);
        }
        [HttpPost("AddEmployeeGuranters", Name = "AddEmployeeGuranters")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canCreateUpdateEmployeePersonalInfo)]
        public async Task<ActionResult<int>> AddEmployeeGuranters([FromBody] AddEmployeeGurantersCommand command)
        {
            var GuranterId = await mediator.Send(command);
            return Ok(GuranterId);
        }
        [HttpPut("UpdateEmployeeGuranters", Name = "UpdateEmployeeGuranters")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canCreateUpdateEmployeePersonalInfo)]
        public async Task<ActionResult<int>> UpdateEmployeeGuranters([FromBody] UpdateEmployeeGurantersCommand command)
        {
            var updatedGuranterId = await mediator.Send(command);
            return Ok(updatedGuranterId);
        }
        [HttpGet("GetEmployeeGurantersById", Name = "GetEmployeeGurantersById")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<EmployeeGurantersDto>>> GetEmployeeGurantersById(int guaranteeId)
        {
            var Id = await mediator.Send(new GetEmployeeGurantersByIdQuery(guaranteeId));
            return Id;
        }
        [HttpGet("GetEmployeeGuaranterOfEmployee", Name = "GetEmployeeGuaranterOfEmployee")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<EmployeeGurantersDto>>> GetEmployeeGuaranterEmployee(int EmployeeId)
        {
            var Id = await mediator.Send(new GetEmployeeGuaranterQuery(EmployeeId));
            return Id;
        }
        //
        [HttpPut("UpdateEmployeeFamily", Name = "UpdateEmployeeFamily")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canCreateUpdateEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> UpdateEmployeeFamily([FromBody] UpdateEmployeeFamilyCommand command)
        {
            var ChildId = await mediator.Send(command);
            return Ok(ChildId);
        }
        [HttpGet("AllFamilyOfAllEmployee", Name = "AllFamilyOfAllEmployee")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<EmployeeFamilyDto>>> AllFamilyOfAllEmployee()
        {
            var family = await mediator.Send(new GetEmployeeFamilyListQuery());
            return family;
        }
        [HttpGet("GetChild", Name = "GetChild")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<EmployeeFamily>>> GetFamily(int familyId)
        {
            var Child = await mediator.Send(new GetEmployeeFamilyListOfFamilyQuery(familyId));
            return Child;
        }
        [HttpGet("GetFamilyOfAnEmployee", Name = "GetFamilyOfAnEmployee")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<EmployeeFamilyDto>>> GetFamilyOfAnEmployee(int EmployeeID)
        {
            var family = await mediator.Send(new GetEmployeeFamilyListOfEmployeeQuery(EmployeeID));
            return family;
        }
        //Added By Me on it.

        //
        //Activate and DeActivate
        [HttpPut("ActivateEmployeeGurantee", Name = "ActivateEmployeeGurantee")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canActivateEmployeePersonalInfo)]
        public async Task<ActionResult<int>> ActivateEmployeeGurantee([FromBody] ActivateEmployeeGurantersCommand command)
        {
            var ActivatedEmployeeGuaranteId = await mediator.Send(command);
            return Ok(ActivatedEmployeeGuaranteId);
        }
        [HttpPut("DeActivateEmployeeGuarantee", Name = "DeActivateEmployeeGuarantee")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canDeactivateEmployeePersonalInfo)]
        public async Task<ActionResult<int>> DeActivateEmployeeGuarantee([FromBody] DeActivateEmployeeGurantersCommand command)
        {
            var DeActivatedEmployeeGuaranteeId = await mediator.Send(command);
            return Ok(DeActivatedEmployeeGuaranteeId);
        }

        //
        //activate and deactivateEmployeeFamily
        [HttpPut("ActivateEmployeeFamily", Name = "ActivateEmployeeFamily")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canActivateEmployeePersonalInfo)]
        public async Task<ActionResult<int>> ActivateEmployeeFamily([FromBody] ActivateEmployeeFamilyCommand command)
        {
            var ActivatedFamilyId = await mediator.Send(command);
            return Ok(ActivatedFamilyId);
        }
        [HttpPut("DeActivateEmployeeFamily", Name = "DeActivateEmployeeFamily")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canDeactivateEmployeePersonalInfo)]
        public async Task<ActionResult<int>> DeActivateEmployeeFamily([FromBody] DeActivateEmployeeFamilyCommand Command)
        {
            var DeActivatedFamily = await mediator.Send(Command);
            return Ok(DeActivatedFamily);
        }
        //
    }
}