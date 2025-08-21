using CMS.API.Controllers;
using CMS.Application.Features.Employees.EmployeeDemotions.Commands;
using CMS.Application.Features.Employees.EmployeeDemotions.DemotionModel;
using CMS.Application.Features.Employees.EmployeeDemotions.DemotionQuery;
using CMS.Application.Features.Employees.EmployeePromotions.Commands;
using CMS.Application.Features.Employees.EmployeePromotions.PromotionModel;
using CMS.Application.Features.Employees.EmployeePromotions.PromotionQuery;
using CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationCommand;
using CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationModel;
using CMS.Application.Features.Employees.ReClassificationEmployee.ReClassificationQuery;
using CMS.Application.Features.Employees.SalaryIncrement.SalaryIncrementCommand;
using CMS.Application.Features.Employees.SalaryIncrement.SalaryIncrementModel;
using CMS.Application.Features.Employees.SalaryIncrement.SalaryIncrementQuery;
using CMS.Application.Security;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMS.Application;

namespace CMS.Api.Controllers.EmployeeController
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeTransactionController : BaseController<EmployeeTransactionController>
    {
        [HttpPost("AddEmployeePromotionCommand")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        public async Task<ActionResult<int>> AddEmployeePromotion([FromBody] AddEmployeePromotionCommand command)
        {
            var AddedPromotion = await mediator.Send(command);
            return AddedPromotion;
        }
        [HttpPost("UpdateEmployeePromotionCommand")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        public async Task<ActionResult<int>> UpdateEmployeePromotion([FromBody] UpdateEmployeePromotionCommand command)
        {
            var updated = await mediator.Send(command);
            return updated;
        }
        [HttpGet("GetEmployeePromotionById")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        public async Task<ActionResult<EmployeePromotion>> GetEmployeePromotionById(int Id)
        {
            return await mediator.Send(new GetEmployeePromotionByIdQuery(Id));

        }
        [HttpGet("GetEmployeePromotionList")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        public async Task<ActionResult<List<EmployeePromotionDto>>> GetEmployeePromotionList(int employeeId)
        {
            return await mediator.Send(new GetEmployeePromotionListOfEmployeeQuery(employeeId));
        }
        [HttpPut("RejectEmployeePromotion")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        public async Task<ActionResult<int>> RejectEmployeePromotion([FromBody] RejectEmployeePromotion command)
        {
            return await mediator.Send(command);
        }
        [HttpPut("ApproveEmployeePromotion")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        public async Task<ActionResult<int>> ApproveEmployeePromotion([FromBody] ApproveEmployeePromotion command)
        {
            return await mediator.Send(command);
        }
        [HttpPut("submitEmployeePromotion")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canSubmitEmployeeActivity)]
        public async Task<ActionResult<int>> SubmittEmployeePromotion([FromBody] SubmitEmployeePromotion command)
        {
            return await mediator.Send(command);
        }
        //Demotion
        [HttpPost("AddEmployeeDemotion")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        public async Task<ActionResult<int>> AddEmployeeDemotion([FromBody] AddEmployeeDemotionCommand command)
        {
            var AddedPromotion = await mediator.Send(command);
            return AddedPromotion;
        }
        [HttpPost("UpdateEmployeeDemotion")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        public async Task<ActionResult<int>> UpdateEmployeeDemotion([FromBody] UpdateEmployeeDemotionCommand command)
        {
            var updated = await mediator.Send(command);
            return updated;
        }
        [HttpGet("GetEmployeeDemotionById")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        public async Task<ActionResult<EmployeeDemotion>> GetEmployeeDemotionById(int Id)
        {
            return await mediator.Send(new GetEmployeeDemotionByIdQuery(Id));

        }
        [HttpGet("GetEmployeeDemotionList")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        public async Task<ActionResult<List<EmployeeDemotionDto>>> GetEmployeeDemotionList(int employeeId)
        {
            return await mediator.Send(new GetEmployeeDemotionListOfEmployeeQuery(employeeId));
        }
        [HttpPut("RejectEmployeeDemotion")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        public async Task<ActionResult<int>> RejectEmployeeDemotion([FromBody] RejectEmployeeDemotion command)
        {
            return await mediator.Send(command);
        }
        [HttpPut("SubmitEmployeeDemotion")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canSubmitEmployeeActivity)]
        public async Task<ActionResult<int>> SubmitEmployeeDemotion([FromBody] SubmitEmployeeDemotion command)
        {
            return await mediator.Send(command);
        }
        //
        [HttpPut("ApproveEmployeeDemotion")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        public async Task<ActionResult<int>> ApproveEmployeeDemotion([FromBody] ApproveEmployeeDemotion command)
        {
            return await mediator.Send(command);
        }
        //SalaryIncrement
        [HttpPost("AddEmployeeSalaryIncrement")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        public async Task<ActionResult<int>> AddEmployeeSalaryIncrement([FromBody] AddSalaryIncrementCommand command)
        {
            var AddedSalary = await mediator.Send(command);
            return AddedSalary;
        }
        [HttpPost("UpdateSalaryIncrement")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        public async Task<ActionResult<int>> UpdateSalaryIncrement([FromBody] UpdateSalaryIncrementCommand command)
        {
            var updated = await mediator.Send(command);
            return updated;
        }
        [HttpGet("GetSalaryIncrementById")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        public async Task<ActionResult<EmployeeSalaryIncrement>> GetSalaryIncrementById(int Id)
        {
            return await mediator.Send(new GetSalaryIncrementByIdQuery(Id));

        }
        [HttpGet("GetAllSalaryIncrementList")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        public async Task<ActionResult<EmployeeSalaryIncrementSearchResult>> GetAllSalaryIncrementList(EmployeeTransactionStatus status, int pageNumber, int pageSize, int employeeId)
        {
            return await mediator.Send(new GetEmployeeSalaryIncrementListQuery(status, pageNumber, pageSize, employeeId));
        }
        [HttpGet("GetSalaryIncrementList")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        public async Task<ActionResult<List<EmployeeSalaryIncrementDto>>> GetSalaryIncrementList(int employeeId)
        {
            return await mediator.Send(new GetSalaryIncrementListOfEmployeeQuery(employeeId));
        }
        [HttpPut("RejectSalaryIncrement")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        public async Task<ActionResult<int>> RejectSalaryIncrement([FromBody] RejectSalaryIncrementCommand command)
        {
            return await mediator.Send(command);
        }
        [HttpPut("SubmitSalaryIncrement")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canSubmitEmployeeActivity)]
        public async Task<ActionResult<int>> SubmitSalaryIncrement([FromBody] SubmitSalaryIncrementCommand command)
        {
            return await mediator.Send(command);
        }
        //
        [HttpPut("ApproveSalaryIncrement")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        public async Task<ActionResult<int>> ApproveSalaryIncrement([FromBody] ApproveSalaryIncrementCommand command)
        {
            return await mediator.Send(command);
        }

        //
        //ReClassification
        [HttpPost("AddEmployeeReClassification")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        public async Task<ActionResult<int>> AddEmployeeReClassification([FromBody] AddEmployeeReClassificationCommand command)
        {
            var AddedReClassification = await mediator.Send(command);
            return AddedReClassification;
        }
        [HttpPost("UpdateEmployeeReClassification")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canCreateUpdateEmployeeActivity)]
        public async Task<ActionResult<int>> UpdateEmployeeReClassification([FromBody] UpdateEmployeeReClassificationCommand command)
        {
            var updated = await mediator.Send(command);
            return updated;
        }
        [HttpGet("GetEmployeeReClassificationById")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        public async Task<ActionResult<EmployeeReClassification>> GetEmployeeReClassificationById(int Id)
        {
            return await mediator.Send(new GetEmployeeReClassificationByIdQuery(Id));

        }
        [HttpGet("GetEmployeeReClassificationList")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        public async Task<ActionResult<List<EmployeeReClassificationDto>>> GetEmployeeReClassificationList(int employeeId)
        {
            return await mediator.Send(new GetEmployeeReClassificationListOfEmployeeQuery(employeeId));
        }
        [HttpPut("RejectEmployeeReClassification")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        public async Task<ActionResult<int>> RejectEmployeeReClassification([FromBody] RejectEmployeeReClassification command)
        {
            return await mediator.Send(command);
        }
        [HttpPut("ApproveEmployeeReClassification")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canApproveRejectEmployeeActivity)]
        public async Task<ActionResult<int>> ApproveEmployeeReClassification([FromBody] ApproveEmployeeReClassification command)
        {
            return await mediator.Send(command);
        }
        [HttpPut("SubmittEmployeeReClassification")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canSubmitEmployeeActivity)]
        public async Task<ActionResult<int>> SubmittEmployeeReClassification([FromBody] SubmitEmployeeReClassification command)
        {
            return await mediator.Send(command);
        }
        //
        //All the 
        [HttpGet("allReClassifications", Name = "GetAllReClassifications")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<EmployeeReClassificationSearchResult>> GetAllReClassifications(EmployeeTransactionStatus status, int pageNumber, int pageSize, int employeeId)
        {
            var searchResult = await mediator.Send(new GetEmployeeReClassificationListQuery(status, pageNumber, pageSize, employeeId));

            return searchResult;
        }
        //All the 
        [HttpGet("allPromotions", Name = "GetAllPromotions")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<EmployeePromotionSearchResult>> GetAllPromotions(EmployeeTransactionStatus status, int pageNumber, int pageSize, int employeeId)
        {
            var searchResult = await mediator.Send(new GetEmployeePromotionListQuery(status, pageNumber, pageSize, employeeId));

            return searchResult;
        }
        [HttpGet("counts", Name = "GetPromotionCountPerApprovalStatus")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<PromotionCountsByStatus> GetPromotionCountPerApprovalStatus()
        {
            return await mediator.Send(new GetPromotionCountPerApprovalStatusQuery());
        }
        //Demotion
        [HttpGet("allDemotions", Name = "AllDemotions")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<EmployeeDemotionSearchResult>> GetAllDemotions(EmployeeTransactionStatus status, int pageNumber, int pageSize, int employeeId)
        {
            var searchResult = await mediator.Send(new GetEmployeeDemotionListQuery(status, pageNumber, pageSize, employeeId));

            return searchResult;
        }
        [HttpGet("TotalDemotion", Name = "GetDemotionCountPerApprovalStatus")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeActivity.canViewEmployeeActivity)]
        [ProducesResponseType(200)]
        public async Task<DemotionCountsByStatus> GetDemotionCountPerApprovalStatus()
        {
            return await mediator.Send(new GetDemotionCountPerApprovalStatusQuery());
        }
    }
}
