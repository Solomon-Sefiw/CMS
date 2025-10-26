using CMS.Application.Features.Attendance.Interface;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Attendance.Commands
{
    public record UpdateDeviceCommand(int Id, bool IsActive, string? Location) : IRequest;
    internal class UpdateDeviceCommandHandler : IRequestHandler<UpdateDeviceCommand>
    {
        private readonly IAttendanceService _service;

        public UpdateDeviceCommandHandler(IAttendanceService service)
        {
            _service = service;
        }

        public Task Handle(UpdateDeviceCommand request, CancellationToken cancellationToken)
        {
            return _service.UpdateDeviceAsync(request.Id, request.IsActive, request.Location);
        }
    }
}
