using CMS.Application.Features.Attendance.Interface;
using CMS.Application.Features.Attendance.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Attendance.Commands
{
    public record ProcessAttendancePushCommand(AttendancePushDto Dto) : IRequest<(bool Success, string? Error)>;
    internal class ProcessAttendancePushCommandHandler : IRequestHandler<ProcessAttendancePushCommand, (bool Success, string? Error)>
    {
        private readonly IAttendanceService _service;

        public ProcessAttendancePushCommandHandler(IAttendanceService service)
        {
            _service = service;
        }

        public Task<(bool Success, string? Error)> Handle(ProcessAttendancePushCommand request, CancellationToken cancellationToken)
        {
            return _service.ProcessPushAsync(request.Dto);
        }
    }
}
