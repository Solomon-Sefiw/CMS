using CMS.Api.Dtos;
using CMS.Application;
using CMS.Application.Features;
using CMS.Application.Features.EmployeeEmergencyContacts.Commands;
using CMS.Application.Features.EmployeeEmergencyContacts.Commands.UpdateEmeregencyContact;
using CMS.Application.Features.EmployeeEmergencyContacts.Models;
using CMS.Application.Features.EmployeeEmergencyContacts.Queries;
using CMS.Application.Features.Employees;
using CMS.Application.Features.Employees.Commands.Documents;
using CMS.Application.Features.Employees.Probation;
using CMS.Application.Features.Employees.Commands.UpdateEmployee;
using CMS.Application.Features.Employees.Queries;
using CMS.Application.Security;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CMS.Application.Features.Employees.EmployeeID.Queries;
using CMS.Application.Features.Employees.EmployeeID;
using CMS.API.Attributes;

namespace CMS.API.Controllers.EmployeeController
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeProfileController : BaseController<EmployeeProfileController>
    {

        [HttpPost("add", Name = "CreateEmployeeProfile")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canCreateUpdateEmployeePersonalInfo)]
        public async Task<ActionResult<CreateEmployeeProfileReturnType>> CreateEmployeeProfile([FromBody] CreateEmployeeProfileCommand employeeProfile)
        {
            var employeeId = await mediator.Send(employeeProfile);
            return Ok(employeeId);
        }
        
        [HttpPost("CreateEmployeeEmergencyContact", Name = "CreateEmployeeEmergencyContact")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canCreateUpdateEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> CreateEmployeeEmergencyContact([FromBody] CreateEmployeeEmergencyContactCommand employeeEmeregencyContact)
        {
            var employeeEmeregencyId = await mediator.Send(employeeEmeregencyContact);
            return Ok(employeeEmeregencyId);
        }

        [HttpPut("UpdateEmployeeEmergencyContactCommand", Name = "UpdateEmployeeEmergencyContactCommand")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canCreateUpdateEmployeePersonalInfo)]
        [ProducesResponseType(200)]

        public async Task<ActionResult<int>> UpdateEmployeeEmergencyContactCommand([FromBody] UpdateEmployeeEmergencyContactCommand employeeEmeregencyContact)
        {
            var employeeEmeregencyId = await mediator.Send(employeeEmeregencyContact);
            return Ok(employeeEmeregencyId);
        }

        [HttpGet("GetEmployeeEmeregencyContact/{employeeId}", Name = "GetEmployeeEmeregencyContact")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<EmployeeEmergencyContactDto>>> GetEmployeeEmergencyContacts(int employeeId)
        {
            var query = new GetEmployeeEmergencyContactsQuery { EmployeeId = employeeId };
            var result = await mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("all", Name = "GetAllEmployees")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<EmployeeDto>>> GetAllEmployees()
        {
            var searchResult = await mediator.Send(new GetEmployeeListQuery());
            return searchResult;
        }

        [HttpGet("{id}/businessUnit", Name = "GetEmployeeByBusinessUnitId")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<List<EmployeeDto>> GetEmployeeByBusinessUnitId(int id)
        {
            var employee = await mediator.Send(new GetEmployeeListByBusinessUnitId { Id = id });
            //employee.PhotoUrl = GetDocumentUrl(employee.PhotoId);

            return employee;
        }

        [HttpGet("allByStatus", Name = "GetAllEmployeesByStatus")]
     //   [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<EmployeeList>> GetAllEmployeesByStatus()
        {
            var searchResult = await mediator.Send(new GetEmployeeListByStatusQuery());
            return searchResult;
        }

        [HttpGet("{id}/info", Name = "GetEmployeeInfo")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<EmployeeDto> GetEmployeeInfo(int id, [FromQuery] Guid? version = null)
        {
            var employee = await mediator.Send(new GetEmployeeInfoQuery(id, version));
            employee.PhotoUrl = GetDocumentUrl(employee.PhotoId);
            return employee;
        }



        [HttpGet("{id}", Name = "GetEmployeeById")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<EmployeeDetailsDto> GetEmployeeById(int id)
        {
            var employee = await mediator.Send(new GetEmployeeDetailQuery { Id = id });
            employee.PhotoUrl = GetDocumentUrl(employee.PhotoId);

            return employee;
        }


        [HttpPost("{id}/add-photo", Name = "AddEmployeePhoto")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canCreateUpdateEmployeePersonalInfo)]
        public async Task<DocumentMetadataDto> AddEmployeePhoto(int id, [FromForm] UploadDocumentDto document)
        {
            var command = new AddEmployeePhotoCommand(id, document.File);
            var doc = await mediator.Send(command);

            return new DocumentMetadataDto(GetDocumentUrl(doc.Id));
        }

        [HttpPost("update", Name = "UpdateEmployee")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canCreateUpdateEmployeePersonalInfo)]
        public async Task<ActionResult<int>> UpdateEmployee([FromBody] UpdateEmployeeCommand basicInfo)
        {
            var employeeId = await mediator.Send(basicInfo);
            return Ok(employeeId);
        }
        //
        [HttpGet("GetSingleEmployee")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<bool>> GetSingleEmployee([FromQuery] MartialStatus id)
        {
            var result = await mediator.Send(new GetSingleEmployeeListById { Single = id });

            if (result)
            {
                return Ok(result);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("{id}/record-versions", Name = "GetEmployeeRecordVersions")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<EmployeeRecordVersions> GetEmployeeRecordVersions(int id)
        {
            return await mediator.Send(new GetEmployeeRecordVersionsQuery(Id: id));
        }

        [HttpPost("submit-for-approval", Name = "SubmitForApproval")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canSubmitEmployeePersonalInfo)]
        public async Task<ActionResult> SubmitForApproval([FromBody] ChangeWorkflowStatusEntityDto payload)
        {
            await mediator.Send(new SubmitEmployeeApprovalRequestCommand(payload.Id, payload.Note));
            return Ok();
        }

        [HttpPost("approve-approval-request", Name = "ApproveEmployee")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canApproveRejectEmployeePersonalInfo)]
        public async Task<ActionResult> ApproveEmployee([FromBody] ChangeWorkflowStatusEntityDto payload)
        {
            await mediator.Send(new ApproveEmployeeCommand(payload.Id, payload.Note));
            return Ok();
        }

        [HttpPost("reject-approval-request", Name = "RejectEmployeeApprovalRequest")]
        [InvalidateQueryTags("Dashboard")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canApproveRejectEmployeePersonalInfo)]
        public async Task<ActionResult> RejectEmployeeApprovalRequest([FromBody] ChangeWorkflowStatusEntityDto payload)
        {
            await mediator.Send(new RejectEmployeeApprovalRequestCommand(payload.Id, payload.Note));
            return Ok();
        }

        [HttpPost("{id}/note", Name = "AddEmployeeNote")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canCreateUpdateEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<ActionResult> AddEmployeeNote(int id, [FromBody] Note payload)
        {
            await mediator.Send(new AddEmployeeCommentCommand(id, Domain.CommentType.Note, payload.Text));
            return Ok();
        }

        [HttpGet("allEmployees", Name = "GetAllEmployeetLists")]
        [ProducesResponseType(200)]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        public async Task<ActionResult<EmployeeSearchResult>> GetAllEmployeetLists(
            int businessUnitId,
            ApprovalStatus Status,
            int pageNumber,
            int pageSize,
            string? searchQuery) // <--- ADDED: Optional searchQuery parameter
        {
            var searchResult = await mediator.Send(new GetEmployeeListWithPaginationQuery(
                businessUnitId,
                Status,
                pageNumber,
                pageSize,
                searchQuery // <--- PASSED: searchQuery to the MediatR query
            ));

            return searchResult;
        }

        [HttpGet("{employeeId}/change-logs", Name = "GetEmployeeChangeLog")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public Task<List<EmployeeChangeLogDto>> GetEmployeeChangeLog(int employeeId)
        {
            return mediator.Send(new GetEmployeeChangeLogQuery(employeeId));
        }

        [HttpGet("GetActiveEmployeeForIdManagement", Name = "GetActiveEmployeeForIdManagement")]
        [Authorize(Policy = AuthPolicy.Employee.PersonalInfo.canViewEmployeePersonalInfo)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<EmployeeDto>>> GetActiveEmployeeForIdManagement()
        {
            var probation = await mediator.Send(new GetActiveEmployeesForIdManagement());
            var employee = new List<EmployeeDto>();
            foreach(var emp in probation)
            {
                if (emp.EmployeeDocuments.Count > 0)
                {
                    emp.PhotoUrl = GetDocumentUrl(emp.EmployeeDocuments.Select(a => a.DocumentId).Last());
                }
               
            }
            return probation;
        }
        //Employee Probation related
        [HttpGet("ProbationCountPerApprovalStatus", Name = "ProbationCountPerApprovalStatus")]
        [Authorize(Policy = AuthPolicy.Employee.Probation.canViewEmployeeProbation)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<GetProbationCountsByStatus>> GetProbationCountPerApprovalStatus()
        {
            return await mediator.Send(new GetProbationCountPerApprovalStatusQuery());
        }
        [HttpGet("GetAllEmployeeOnProbation", Name = "GetAllEmployeeOnProbation")]
        [Authorize(Policy = AuthPolicy.Employee.Probation.canViewEmployeeProbation)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<EmployeeDto>>> GetAllEmployeeOnProbation()
        {
            var probation = await mediator.Send(new GetAllEmployeesOnProbationQuery());
            return probation;
        }
        //
        [HttpGet("GetProbationList", Name = "GetProbationList")]
        [Authorize(Policy = AuthPolicy.Employee.Probation.canViewEmployeeProbation)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<ProbationSearchResult>> GetProbationList(EmployeeStatusEnum status, int pageNumber, int pageSize)
        {
            return await mediator.Send(new GetProbationListQuery(status, pageNumber, pageSize));
        }

        [HttpPost("AllEmployeeApproveProbation", Name = "AllEmployeeApproveProbation")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> AllEmployeeApproveProbation([FromBody] AllEmployeeApproveCommand commnad)
        {
            var AllPassedProbtion = await mediator.Send(commnad);
            return AllPassedProbtion;
        }
        [HttpPost("EmployeeProbationApprove", Name = "EmployeeProbationApprove")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Employee.Probation.canSubmitEmployeeProbation)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> EmployeeProbationApprove([FromBody] EmployeeProbationApproveCommand command)
        {
            var probationPassed = await mediator.Send(command);
            return probationPassed;
        }
        [HttpPost("EmployeeProbationTermination", Name = "EmployeeProbationTermination")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Employee.Probation.canTerminateEmployeeProbation)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> EmployeeProbationTermination([FromBody] EmployeeProbationTerminationCommand command)
        {
            var notPassedProbation = await mediator.Send(command);
            return notPassedProbation;
        }
        [HttpPost("ProbationSubmit", Name = "ProbationSubmit")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Employee.Probation.canSubmitEmployeeProbation)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> ProbationSubmit([FromBody] ProbationSubmitToApproverCommand command)
        {
            return await mediator.Send(command);
        }
        [HttpPost("ProbationApproval", Name = "ProbationApproval")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Employee.Probation.canApproveRejectEmployeeProbation)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> ProbationApproval([FromBody] ProbationApprovalCommand command)
        {
            return await mediator.Send(command);
        }
        [HttpPost("ProbationTerminate", Name = "ProbationTerminate")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Employee.Probation.canTerminateEmployeeProbation)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> ProbationTerminate([FromBody] ProbationTerminateCommand command)
        {
            return await mediator.Send(command);
        }
        [HttpPost("RejectProbation", Name = "RejectProbation")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Employee.Probation.canApproveRejectEmployeeProbation)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> RejectProbationApproval([FromBody] ProbationRejectApprovalCommand Command)
        {
            return await mediator.Send(Command);
        }
        [HttpPost("RejectedProbationActivate",Name = "RejectedProbationActivate")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Employee.Probation.canActivateDeactivateEmployeeProbation)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> RejectedProbationActivate([FromBody] RejectedProbationActivateCommand command)
        {
            return await mediator.Send(command);
        }
        [HttpGet("GetAllProbationForNotification",Name = "GetAllProbationForNotification")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<EmployeeDto>>> GetAllProbationForNotification()
        {
            return await mediator.Send(new GetAllProbationForNotificationQuery());
        }
        [HttpPost("EmployeeIDCardGiven", Name = "EmployeeIDCardGiven")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeId.canGiveEmployeeId)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> EmployeeIDCardGiven([FromBody]EmployeeIDCardGivenCommand command)
        {
            return await mediator.Send(command);
        }
        [HttpPost("EmployeeIDCardReplace", Name = "EmployeeIDCardReplace")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeId.canReplaceEmployeeId)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> EmployeeIDCardReplace(EmployeeIDCardReplaceCommand command)
        {
            return await mediator.Send(command);
        }
        [HttpPost("EmployeeIDCardApprovalRejected", Name = "EmployeeIDCardApprovalRejected")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeId.canApproveRejectEmployeeId)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> EmployeeIDCardApprovalRejected(EmployeeIDCardApprovalRejectedCommand command)
        {
            return await mediator.Send(command);
        }
        [HttpPost("EmployeeIDCardApprovalApproval", Name = "EmployeeIDCardApprovalApproval")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeId.canApproveRejectEmployeeId)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> EmployeeIDCardApprovalApproval(EmployeeIDCardApprovalApprovalCommand command)
        {
            return await mediator.Send(command);
        }
        //GetAllEmployeeIDListQuery
        [HttpGet("GetAllEmployeeIDList", Name = "GetAllEmployeeIDList")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeId.canViewEmployeeId)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<EmployeeIDSearchResult>> GetAllEmployeeIDList(EmployeeIDCardStatus status, int pageNumber, int pageSize)
        {
            return await mediator.Send(new GetAllEmployeeIDListQuery(status, pageNumber, pageSize));
        }

        [HttpGet("GetEmployeeIDCountPerApprovalStatus", Name = "GetEmployeeIDCountPerApprovalStatus")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeId.canViewEmployeeId)]
        [ProducesResponseType(200)] 
        public async Task<ActionResult<GetEmployeeIDCountsByStatus>> GetEmployeeIDCountPerApprovalStatus()
        {
            return await mediator.Send(new GetEmployeeIDCountPerApprovalStatusQuery());
        }
        [HttpGet("GetAllEmployeesIDCardInfo",Name = "GetAllEmployeesIDCardInfo")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeId.canViewEmployeeId)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<List<EmployeeDto>>> GetAllEmployeesIDCardInfo()
        {
            return await mediator.Send(new GetAllEmployeesIDCardInfoQuery());
        }
        [HttpPost("EmployeeIDCardSubmit",Name = "EmployeeIDCardSubmit")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeId.canSubmitEmployeeId)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> EmployeeIDCardSubmit([FromBody] EmployeeIDCardSubmitCommand command)
        { 
            return await mediator.Send(command);
        }
        [HttpPost("EmployeeIDCardUpdate", Name = "EmployeeIDCardUpdate")]
        [InvalidateQueryTags("Dashboard")]
        [Authorize(Policy = AuthPolicy.Employee.EmployeeId.canCreateUpdateEmployeeId)]
        [ProducesResponseType(200)]
        public async Task<ActionResult<int>> EmployeeIDCardUpdate([FromBody] EmployeeIDCardUpdateCommand command)
        {
            return await mediator.Send(command);
        }
    }
}
