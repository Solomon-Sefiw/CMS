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
    public record AddManualAttendanceCommand(ManualAttendanceDto Dto) : IRequest<int>;
    internal class AddManualAttendanceCommandHandler : IRequestHandler<AddManualAttendanceCommand, int>
    {
        private readonly IAttendanceService _service;

        public AddManualAttendanceCommandHandler(IAttendanceService service)
        {
            _service = service;
        }

        public async Task<int> Handle(AddManualAttendanceCommand request, CancellationToken cancellationToken)
        {
            var log = await _service.AddManualAsync(request.Dto);
            return log.Id;
        }
    }
}
