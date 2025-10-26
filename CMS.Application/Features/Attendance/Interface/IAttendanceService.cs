using CMS.Application.Features.Attendance.Models;
using CMS.Domain.Attendance;

namespace CMS.Application.Features.Attendance.Interface
{

    public interface IAttendanceService
    {
        Task<(bool Success, string? Error)> ProcessPushAsync(AttendancePushDto dto, CancellationToken cancellationToken = default);
        Task<AttendanceLog> AddManualAsync(ManualAttendanceDto dto, CancellationToken cancellationToken = default);
        Task<List<AttendanceLogDto>> GetLogsAsync(DateTime? fromUtc, DateTime? toUtc, int? employeeId, int pageNumber, int pageSize, CancellationToken cancellationToken = default);
        Task<List<DailyAttendanceSummaryDto>> GetDailySummaryAsync(DateOnly date, int? businessUnitId = null, CancellationToken cancellationToken = default);
        Task<List<DailyAttendanceSummaryDto>> GetMonthlySummaryAsync(int year, int month, int? employeeId = null, CancellationToken cancellationToken = default);
        Task<Device> RegisterDeviceAsync(RegisterDeviceDto dto, CancellationToken cancellationToken = default);
        Task<List<Device>> GetDevicesAsync(CancellationToken cancellationToken = default);
        Task UpdateDeviceAsync(int id, bool isActive, string? location = null, CancellationToken cancellationToken = default);
    }
    //public interface IAttendanceService
    //{
    //    Task<(bool Success, string? Error)> ProcessPushAsync(AttendancePushDto dto);
    //    Task<AttendanceLog> AddManualAsync(ManualAttendanceDto dto);
    //    Task<List<AttendanceLogDto>> GetLogsAsync(DateTime? fromUtc, DateTime? toUtc, int? employeeId, int pageNumber, int pageSize);
    //    Task<List<DailyAttendanceSummaryDto>> GetDailySummaryAsync(DateOnly date, int? businessUnitId = null);
    //    Task<List<DailyAttendanceSummaryDto>> GetMonthlySummaryAsync(int year, int month, int? employeeId = null);
    //    Task<Device> RegisterDeviceAsync(RegisterDeviceDto dto);
    //    Task<List<Device>> GetDevicesAsync();
    //    Task UpdateDeviceAsync(int id, bool isActive, string? location = null);
    //}
}
