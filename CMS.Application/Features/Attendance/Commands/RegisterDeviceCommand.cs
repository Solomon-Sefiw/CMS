using CMS.Application.Features.Attendance.Interface;
using CMS.Application.Features.Attendance.Models;
using CMS.Domain.Attendance;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Attendance.Commands
{
    public record RegisterDeviceCommand(RegisterDeviceDto Dto) : IRequest<Device>;
    internal class RegisterDeviceCommandHandler : IRequestHandler<RegisterDeviceCommand, Device>
    {
        private readonly IAttendanceService _service;

        public RegisterDeviceCommandHandler(IAttendanceService service)
        {
            _service = service;
        }

        public Task<Device> Handle(RegisterDeviceCommand request, CancellationToken cancellationToken)
        {
            return _service.RegisterDeviceAsync(request.Dto);
        }
    }
}
