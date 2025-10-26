using CMS.Application.Features.Attendance.Interface;
using CMS.Application.Features.Attendance.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Attendance.Queries
{
    public record GetAttendanceLogsQuery(DateTime? FromUtc, DateTime? ToUtc, int? EmployeeId, int PageNumber, int PageSize) : IRequest<List<AttendanceLogDto>>;
    internal class GetAttendanceLogsQueryHandler : IRequestHandler<GetAttendanceLogsQuery, List<AttendanceLogDto>>
    {
        private readonly IAttendanceService _service;

        public GetAttendanceLogsQueryHandler(IAttendanceService service)
        {
            _service = service;
        }

        public Task<List<AttendanceLogDto>> Handle(GetAttendanceLogsQuery request, CancellationToken cancellationToken)
        {
            return _service.GetLogsAsync(request.FromUtc, request.ToUtc, request.EmployeeId, request.PageNumber, request.PageSize);
        }
    }

}
