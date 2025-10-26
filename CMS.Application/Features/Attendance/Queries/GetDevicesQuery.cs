using CMS.Application.Features.Attendance.Interface;
using CMS.Domain.Attendance;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Attendance.Queries
{
    public record GetDevicesQuery : IRequest<List<Device>>;

    internal class GetDevicesQueryHandler : IRequestHandler<GetDevicesQuery, List<Device>>
    {
        private readonly IAttendanceService _service;

        public GetDevicesQueryHandler(IAttendanceService service)
        {
            _service = service;
        }

        public Task<List<Device>> Handle(GetDevicesQuery request, CancellationToken cancellationToken)
        {
            return _service.GetDevicesAsync();
        }
    }
}
