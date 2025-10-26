using CMS.API.Attributes;

using CMS.Application.Features.Attendance.Commands;
using CMS.Application.Features.Attendance.Models;
using CMS.Application.Features.Attendance.Queries;
using CMS.Domain.Attendance;
using Microsoft.AspNetCore.Mvc;

    namespace CMS.API.Controllers.AttendanceController
    {
        [Route("api/[controller]")]
        [ApiController]
        public class AttendanceController : BaseController<AttendanceController>
        {
            [HttpPost("push")]
            [ProducesResponseType(200)]
            [ProducesResponseType(400)]
            public async Task<ActionResult> Push([FromBody] AttendancePushDto dto)
            {
                var (success, error) = await mediator.Send(new ProcessAttendancePushCommand(dto));
                if (!success) return BadRequest(error);
                return Ok();
            }

            [HttpPost("manual")]
            [InvalidateQueryTags("Dashboard")]
          //  [Authorize(Policy = AuthPolicy.Employee.Attendance.CanCreateManual)]  // Add policy as per your AuthPolicy
            [ProducesResponseType(200)]
            public async Task<ActionResult<int>> Manual([FromBody] ManualAttendanceDto dto)
            {
                var id = await mediator.Send(new AddManualAttendanceCommand(dto));
                return Ok(id);
            }

            [HttpGet("logs")]
          //  [Authorize(Policy = AuthPolicy.Employee.Attendance.CanViewLogs)]
            [ProducesResponseType(200)]
            public async Task<ActionResult<List<AttendanceLogDto>>> Logs([FromQuery] DateTime? fromUtc, [FromQuery] DateTime? toUtc, [FromQuery] int? employeeId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
            {
                var logs = await mediator.Send(new GetAttendanceLogsQuery(fromUtc, toUtc, employeeId, pageNumber, pageSize));
                return Ok(logs);
            }

            [HttpGet("daily-summary")]
          //  [Authorize(Policy = AuthPolicy.Employee.Attendance.CanViewReports)]
            [ProducesResponseType(200)]
            public async Task<ActionResult<List<DailyAttendanceSummaryDto>>> DailySummary([FromQuery] DateOnly date, [FromQuery] int? businessUnitId)
            {
                var summary = await mediator.Send(new GetDailyAttendanceSummaryQuery(date, businessUnitId));
                return Ok(summary);
            }

            [HttpGet("monthly-summary")]
          //  [Authorize(Policy = AuthPolicy.Employee.Attendance.CanViewReports)]
            [ProducesResponseType(200)]
            public async Task<ActionResult<List<DailyAttendanceSummaryDto>>> MonthlySummary([FromQuery] int year, [FromQuery] int month, [FromQuery] int? employeeId)
            {
                var summary = await mediator.Send(new GetMonthlyAttendanceSummaryQuery(year, month, employeeId));
                return Ok(summary);
            }

            [HttpPost("devices")]
            [InvalidateQueryTags("Dashboard")]
          //  [Authorize(Policy = AuthPolicy.Employee.Attendance.CanManageDevices)]
            [ProducesResponseType(200)]
            public async Task<ActionResult<Device>> RegisterDevice([FromBody] RegisterDeviceDto dto)
            {
                var device = await mediator.Send(new RegisterDeviceCommand(dto));
                return Ok(device);
            }

            [HttpGet("devices")]
          //  [Authorize(Policy = AuthPolicy.Employee.Attendance.CanViewDevices)]
            [ProducesResponseType(200)]
            public async Task<ActionResult<List<Device>>> GetDevices()
            {
                var devices = await mediator.Send(new GetDevicesQuery());
                return Ok(devices);
            }

            [HttpPut("devices/{id}")]
            [InvalidateQueryTags("Dashboard")]
          //  [Authorize(Policy = AuthPolicy.Employee.Attendance.CanManageDevices)]
            [ProducesResponseType(200)]
            public async Task<ActionResult> UpdateDevice(int id, [FromBody] UpdateDeviceDto dto)
            {
                await mediator.Send(new UpdateDeviceCommand(id, dto.IsActive, dto.Location));
                return Ok();
            }
        }
}
