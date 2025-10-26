using CMS.Application.Features.Attendance.Models;

using CMS.Common;
using CMS.Domain.Attendance;
using CMS.Domain.Enums;
using CMS.Domain.Notifications;
using CMS.Services.DataService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CMS.Application.Features.Attendance.Interface
{
    public class AttendanceService : IAttendanceService
    {
        private readonly IDataService _dataService;
        private readonly IUserService _userService;
        private readonly ILogger<AttendanceService> _logger;

        // Configurable rules (use TimeOnly for time-of-day)
        private readonly TimeOnly _morningStart = new TimeOnly(8, 0); // 8:00 AM local
        private readonly TimeOnly _morningEnd = new TimeOnly(12, 0); // 12:00 PM local
        private readonly TimeOnly _afternoonStart = new TimeOnly(13, 0); // 1:00 PM local
        private readonly TimeOnly _afternoonEnd = new TimeOnly(17, 0); // 5:00 PM local
        private readonly TimeZoneInfo _defaultTz = TimeZoneInfo.FindSystemTimeZoneById("Africa/Addis_Ababa"); // UTC+3 for Ethiopia

        public AttendanceService(IDataService dataService, IUserService userService, ILogger<AttendanceService> logger)
        {
            _dataService = dataService;
            _userService = userService;
            _logger = logger;
        }

        private TimeZoneInfo GetTimeZoneForEmployee(int employeeId)
        {
            // Lookup from Employee.BusinessUnit or Branch; default to UTC+3
            return _defaultTz;
        }

        private DateTime ToLocal(DateTime utc, TimeZoneInfo tz) => TimeZoneInfo.ConvertTimeFromUtc(utc, tz);

        private AttendanceSession GetSession(TimeOnly localTime)
        {
            return localTime < _morningEnd ? AttendanceSession.Morning : AttendanceSession.Afternoon;
        }

        private AttendanceAction GetAction(int empId, AttendanceSession session, DateOnly date, int deviceStatus)
        {
            var todayLogs = _dataService.AttendanceLogs
                .Where(a => a.EmployeeId == empId && a.TimestampUtc.Date == date.ToDateTime(TimeOnly.MinValue).ToUniversalTime().Date
                    && a.Session == session)
                .OrderBy(a => a.TimestampUtc)
                .ToList();

            if (todayLogs.Count % 2 == 0) return AttendanceAction.In;
            return AttendanceAction.Out;
        }

        public async Task<(bool Success, string? Error)> ProcessPushAsync(AttendancePushDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                if (!int.TryParse(dto.EmpCode, out var empId))
                {
                    var emp = await _dataService.Employees.FirstOrDefaultAsync(e => e.DisplayName == dto.EmpCode || e.TinNumber == dto.EmpCode, cancellationToken);
                    if (emp == null) return (false, "Unknown employee code");
                    empId = emp.Id;
                }

                var employee = await _dataService.Employees.FindAsync(new object[] { empId }, cancellationToken);
                if (employee == null || employee.EmployeeStatus != EmployeeStatusEnum.Active)
                    return (false, "Inactive or unknown employee");

                var device = await _dataService.Devices.FirstOrDefaultAsync(d => d.SerialNumber == dto.DeviceSerial && d.IsActive, cancellationToken);
                if (device == null) return (false, "Unregistered or inactive device");

                if (!DateTime.TryParse(dto.Timestamp, out var parsedTs))
                    return (false, "Invalid timestamp format");

                var timestampUtc = TimeZoneInfo.ConvertTimeToUtc(parsedTs, _defaultTz); // Assume device sends local time

                var tz = GetTimeZoneForEmployee(empId);
                var localTime = TimeOnly.FromDateTime(ToLocal(timestampUtc, tz));
                var session = GetSession(localTime);
                var date = DateOnly.FromDateTime(ToLocal(timestampUtc, tz));
                int statusInt = int.Parse(dto.Status ?? "0");
                var action = GetAction(empId, session, date, statusInt);

                var log = new AttendanceLog
                {
                    EmployeeId = empId,
                    DeviceSerial = dto.DeviceSerial,
                    DeviceStatus = statusInt,
                    Session = session,
                    Action = action,
                    TimestampUtc = timestampUtc,
                    CreatedByUserId = _userService.GetCurrentUserId() ?? "SYSTEM",
                    Notes = "Biometric push"
                };

                _dataService.AttendanceLogs.Add(log);
                await _dataService.SaveAsync(cancellationToken);

                //if (IsLate(localTime, session))
                //{
                //    var notif = new Domain.Notifications.Notification
                //    {
                //        UserId = employee.Id.ToString(),
                //        Message = $"Employee {employee.DisplayName} marked late on {date} ({session})",
                //        CreatedAt = DateTime.UtcNow,
                //        IsRead = false
                //    };
                //    _dataService.Notifications.Add(notif);
                //    await _dataService.SaveAsync(cancellationToken);
                //}

                return (true, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Push processing error for EmpCode {EmpCode}", dto.EmpCode);
                return (false, ex.Message);
            }
        }

        private bool IsLate(TimeOnly localTime, AttendanceSession session)
        {
            var lateThreshold = TimeSpan.FromMinutes(15);
            return (session == AttendanceSession.Morning && localTime > _morningStart.Add(lateThreshold)) ||
                   (session == AttendanceSession.Afternoon && localTime > _afternoonStart.Add(lateThreshold));
        }

        public async Task<AttendanceLog> AddManualAsync(ManualAttendanceDto dto, CancellationToken cancellationToken = default)
        {
            var employee = await _dataService.Employees.FindAsync(new object[] { dto.EmployeeId }, cancellationToken);
            if (employee == null || employee.EmployeeStatus != EmployeeStatusEnum.Active)
                throw new Exception("Inactive employee");

            var tz = GetTimeZoneForEmployee(dto.EmployeeId);
            var localTime = TimeOnly.FromDateTime(ToLocal(dto.TimestampUtc, tz));
            var session = GetSession(localTime);
            var date = DateOnly.FromDateTime(ToLocal(dto.TimestampUtc, tz));
            var action = dto.ForceOut ? AttendanceAction.Out : GetAction(dto.EmployeeId, session, date, dto.ForceOut ? 1 : 0);

            var log = new AttendanceLog
            {
                EmployeeId = dto.EmployeeId,
                DeviceSerial = dto.DeviceSerial ?? "MANUAL",
                DeviceStatus = dto.ForceOut ? 1 : 0,
                Session = session,
                Action = action,
                TimestampUtc = dto.TimestampUtc,
                IsManual = true,
                Notes = dto.Notes,
                CreatedByUserId = _userService.GetCurrentUserId()
            };

            _dataService.AttendanceLogs.Add(log);
            await _dataService.SaveAsync(cancellationToken);
            return log;
        }

        public async Task<List<AttendanceLogDto>> GetLogsAsync(DateTime? fromUtc, DateTime? toUtc, int? employeeId, int pageNumber, int pageSize, CancellationToken cancellationToken = default)
        {
            var query = _dataService.AttendanceLogs.AsQueryable();

            if (employeeId.HasValue) query = query.Where(l => l.EmployeeId == employeeId.Value);
            if (fromUtc.HasValue) query = query.Where(l => l.TimestampUtc >= fromUtc.Value);
            if (toUtc.HasValue) query = query.Where(l => l.TimestampUtc <= toUtc.Value);

            return await query
                .OrderByDescending(l => l.TimestampUtc)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(l => new AttendanceLogDto
                {
                    Id = l.Id,
                    EmployeeId = l.EmployeeId,
                    EmployeeDisplayName = l.Employee != null ? l.Employee.DisplayName : string.Empty,
                    DeviceSerial = l.DeviceSerial,
                    TimestampUtc = l.TimestampUtc,
                    Session = l.Session.ToString(),
                    Action = l.Action.ToString(),
                    IsManual = l.IsManual,
                    Notes = l.Notes
                })
                .ToListAsync(cancellationToken);
        }

        public async Task<List<DailyAttendanceSummaryDto>> GetDailySummaryAsync(DateOnly date, int? businessUnitId = null, CancellationToken cancellationToken = default)
        {
            var fromUtc = date.ToDateTime(TimeOnly.MinValue).ToUniversalTime();
            var toUtc = date.AddDays(1).ToDateTime(TimeOnly.MinValue).ToUniversalTime();

            var query = _dataService.AttendanceLogs
                .Where(l => l.TimestampUtc >= fromUtc && l.TimestampUtc < toUtc);

            if (businessUnitId.HasValue)
                query = query.Where(l => l.Employee != null && l.Employee.BusinessUnitID == businessUnitId.Value);

            var logs = await query
                .Include(l => l.Employee)
                .ToListAsync(cancellationToken);

            var summaries = logs.GroupBy(l => l.EmployeeId)
                .Select(g =>
                {
                    var emp = g.First().Employee;
                    var tz = GetTimeZoneForEmployee(g.Key);
                    var localLogs = g.Select(l => new { Log = l, LocalTs = ToLocal(l.TimestampUtc, tz) }).ToList();

                    var morningIn = localLogs
                        .Where(ll => ll.Log.Session == AttendanceSession.Morning && ll.Log.Action == AttendanceAction.In)
                        .Select(ll => (TimeOnly?)TimeOnly.FromDateTime(ll.LocalTs))
                        .Min();
                    var morningOut = localLogs
                        .Where(ll => ll.Log.Session == AttendanceSession.Morning && ll.Log.Action == AttendanceAction.Out)
                        .Select(ll => (TimeOnly?)TimeOnly.FromDateTime(ll.LocalTs))
                        .Max();
                    var afternoonIn = localLogs
                        .Where(ll => ll.Log.Session == AttendanceSession.Afternoon && ll.Log.Action == AttendanceAction.In)
                        .Select(ll => (TimeOnly?)TimeOnly.FromDateTime(ll.LocalTs))
                        .Min();
                    var afternoonOut = localLogs
                        .Where(ll => ll.Log.Session == AttendanceSession.Afternoon && ll.Log.Action == AttendanceAction.Out)
                        .Select(ll => (TimeOnly?)TimeOnly.FromDateTime(ll.LocalTs))
                        .Max();

                    TimeSpan morningDuration = TimeSpan.Zero;
                    if (morningIn.HasValue && morningOut.HasValue && morningOut.Value > morningIn.Value)
                    {
                        morningDuration = morningOut.Value.ToTimeSpan() - morningIn.Value.ToTimeSpan();
                    }

                    TimeSpan afternoonDuration = TimeSpan.Zero;
                    if (afternoonIn.HasValue && afternoonOut.HasValue && afternoonOut.Value > afternoonIn.Value)
                    {
                        afternoonDuration = afternoonOut.Value.ToTimeSpan() - afternoonIn.Value.ToTimeSpan();
                    }

                    var totalHours = morningDuration + afternoonDuration;

                    TimeSpan late = TimeSpan.Zero;
                    if (morningIn.HasValue && morningIn.Value > _morningStart)
                        late += morningIn.Value.ToTimeSpan() - _morningStart.ToTimeSpan();
                    if (afternoonIn.HasValue && afternoonIn.Value > _afternoonStart)
                        late += afternoonIn.Value.ToTimeSpan() - _afternoonStart.ToTimeSpan();

                    TimeSpan early = TimeSpan.Zero;
                    if (morningOut.HasValue && morningOut.Value < _morningEnd)
                        early += _morningEnd.ToTimeSpan() - morningOut.Value.ToTimeSpan();
                    if (afternoonOut.HasValue && afternoonOut.Value < _afternoonEnd)
                        early += _afternoonEnd.ToTimeSpan() - afternoonOut.Value.ToTimeSpan();

                    return new DailyAttendanceSummaryDto
                    {
                        Date = date,
                        EmployeeId = g.Key,
                        EmployeeDisplayName = emp?.DisplayName ?? string.Empty,
                        MorningIn = morningIn,
                        MorningOut = morningOut,
                        AfternoonIn = afternoonIn,
                        AfternoonOut = afternoonOut,
                        TotalHours = totalHours,
                        LateMinutes = late,
                        EarlyLeaveMinutes = early,
                        IsAbsent = !localLogs.Any()
                    };
                })
                .ToList();

            // Include absent employees
            if (businessUnitId.HasValue)
            {
                var activeEmployees = await _dataService.Employees
                    .Where(e => e.EmployeeStatus == EmployeeStatusEnum.Active && e.BusinessUnitID == businessUnitId.Value)
                    .ToListAsync(cancellationToken);

                var absentEmployees = activeEmployees
                    .Where(e => !logs.Any(l => l.EmployeeId == e.Id))
                    .Select(e => new DailyAttendanceSummaryDto
                    {
                        Date = date,
                        EmployeeId = e.Id,
                        EmployeeDisplayName = e.DisplayName,
                        MorningIn = null,
                        MorningOut = null,
                        AfternoonIn = null,
                        AfternoonOut = null,
                        TotalHours = TimeSpan.Zero,
                        LateMinutes = TimeSpan.Zero,
                        EarlyLeaveMinutes = TimeSpan.Zero,
                        IsAbsent = true
                    });

                summaries.AddRange(absentEmployees);
            }

            return summaries;
        }

        public async Task<List<DailyAttendanceSummaryDto>> GetMonthlySummaryAsync(int year, int month, int? employeeId = null, CancellationToken cancellationToken = default)
        {
            var from = new DateOnly(year, month, 1);
            var to = from.AddMonths(1);
            var summaries = new List<DailyAttendanceSummaryDto>();

            for (var d = from; d < to; d = d.AddDays(1))
            {
                var daily = await GetDailySummaryAsync(d, null, cancellationToken);
                if (employeeId.HasValue)
                    summaries.AddRange(daily.Where(s => s.EmployeeId == employeeId.Value));
                else
                    summaries.AddRange(daily);
            }

            return summaries;
        }

        public async Task<Device> RegisterDeviceAsync(RegisterDeviceDto dto, CancellationToken cancellationToken = default)
        {
            var device = new Device
            {
                SerialNumber = dto.SerialNumber,
                Model = dto.Model,
                IpAddress = dto.IpAddress,
                Location = dto.Location
            };
            _dataService.Devices.Add(device);
            await _dataService.SaveAsync(cancellationToken);
            return device;
        }

        public async Task<List<Device>> GetDevicesAsync(CancellationToken cancellationToken = default)
        {
            return await _dataService.Devices.ToListAsync(cancellationToken);
        }

        public async Task UpdateDeviceAsync(int id, bool isActive, string? location = null, CancellationToken cancellationToken = default)
        {
            var device = await _dataService.Devices.FindAsync(new object[] { id }, cancellationToken);
            if (device == null) throw new Exception("Device not found");
            device.IsActive = isActive;
            if (location != null) device.Location = location;
            await _dataService.SaveAsync(cancellationToken);
        }
    }
    //public class AttendanceService : IAttendanceService
    //{
    //    private readonly IDataService _dataService;
    //    private readonly IUserService _userService;
    //    private readonly ILogger<AttendanceService> _logger;

    //    // Configurable rules (e.g., from appsettings or DB)
    //    private readonly TimeSpan _morningStart = TimeSpan.FromHours(8);  // 8:00 AM local
    //    private readonly TimeSpan _morningEnd = TimeSpan.FromHours(12);
    //    private readonly TimeSpan _afternoonStart = TimeSpan.FromHours(13);  // 1:00 PM local
    //    private readonly TimeSpan _afternoonEnd = TimeSpan.FromHours(17);
    //    private readonly TimeZoneInfo _defaultTz = TimeZoneInfo.FindSystemTimeZoneById("Africa/Addis_Ababa");  // UTC+3 for Ethiopia

    //    public AttendanceService(IDataService dataService, IUserService userService, ILogger<AttendanceService> logger)
    //    {
    //        _dataService = dataService;
    //        _userService = userService;
    //        _logger = logger;
    //    }

    //    private TimeZoneInfo GetTimeZoneForEmployee(int employeeId)
    //    {
    //        // Lookup from Employee.BusinessUnit or Branch; default to UTC+3
    //        return _defaultTz;
    //    }

    //    private DateTime ToLocal(DateTime utc, TimeZoneInfo tz) => TimeZoneInfo.ConvertTimeFromUtc(utc, tz);

    //    private AttendanceSession GetSession(TimeSpan localTime)
    //    {
    //        return localTime < _morningEnd ? AttendanceSession.Morning : AttendanceSession.Afternoon;
    //    }

    //    private AttendanceAction GetAction(int empId, AttendanceSession session, DateOnly date, int deviceStatus)
    //    {
    //        var todayLogs = _dataService.AttendanceLogs
    //            .Where(a => a.EmployeeId == empId && a.TimestampUtc.Date == date.ToDateTime(TimeSpan.Zero).ToUniversalTime().Date
    //                && a.Session == session)
    //            .OrderBy(a => a.TimestampUtc)
    //            .ToList();

    //        if (todayLogs.Count % 2 == 0) return AttendanceAction.In;
    //        return AttendanceAction.Out;
    //    }

    //    public async Task<(bool Success, string? Error)> ProcessPushAsync(AttendancePushDto dto)
    //    {
    //        CancellationToken cancellationToken = CancellationToken.None;
    //        try
    //        {
    //            if (!int.TryParse(dto.EmpCode, out var empId))
    //            {
    //                var emp = await _dataService.Employees.FirstOrDefaultAsync(e => e.DisplayName == dto.EmpCode || e.TinNumber == dto.EmpCode);
    //                if (emp == null) return (false, "Unknown employee code");
    //                empId = emp.Id;
    //            }

    //            var employee = await _dataService.Employees.FindAsync(empId);
    //            if (employee == null || employee.EmployeeStatus != EmployeeStatusEnum.Active)
    //                return (false, "Inactive or unknown employee");

    //            var device = await _dataService.Devices.FirstOrDefaultAsync(d => d.SerialNumber == dto.DeviceSerial && d.IsActive);
    //            if (device == null) return (false, "Unregistered or inactive device");

    //            if (!DateTime.TryParse(dto.Timestamp, out var parsedTs))
    //                return (false, "Invalid timestamp format");

    //            var timestampUtc = TimeZoneInfo.ConvertTimeToUtc(parsedTs, _defaultTz);  // Assume device sends local time

    //            var tz = GetTimeZoneForEmployee(empId);
    //            var localTime = ToLocal(timestampUtc, tz).TimeOfDay;
    //            var session = GetSession(localTime);
    //            var date = DateOnly.FromDateTime(ToLocal(timestampUtc, tz));
    //            int statusInt = int.Parse(dto.Status ?? "0");
    //            var action = GetAction(empId, session, date, statusInt);

    //            var log = new AttendanceLog
    //            {
    //                EmployeeId = empId,
    //                DeviceSerial = dto.DeviceSerial,
    //                DeviceStatus = statusInt,
    //                Session = session,
    //                Action = action,
    //                TimestampUtc = timestampUtc,
    //                CreatedByUserId = _userService.GetCurrentUserId() ?? "SYSTEM",  // For push, system
    //                Notes = "Biometric push"
    //            };

    //            _dataService.AttendanceLogs.Add(log);
    //            await _dataService.SaveAsync(cancellationToken);

    //            //// Optional: Trigger notification if late/early
    //            //if (IsLate(localTime, session))
    //            //{
    //            //    // Add to your Notifications collection
    //            //    var notif = new Notification { /* ... */ };
    //            //    employee.Notifications.Add(notif);
    //            //    await _dataService.SaveAsync();
    //            //}

    //            return (true, null);
    //        }
    //        catch (Exception ex)
    //        {
    //            _logger.LogError(ex, "Push processing error");
    //            return (false, ex.Message);
    //        }
    //    }

    //    private bool IsLate(TimeSpan localTime, AttendanceSession session)
    //    {
    //        return (session == AttendanceSession.Morning && localTime > _morningStart.Add(TimeSpan.FromMinutes(15))) ||
    //               (session == AttendanceSession.Afternoon && localTime > _afternoonStart.Add(TimeSpan.FromMinutes(15)));
    //    }

    //    public async Task<AttendanceLog> AddManualAsync(ManualAttendanceDto dto)
    //    {
    //        CancellationToken cancellationToken = CancellationToken.None;
    //        var employee = await _dataService.Employees.FindAsync(dto.EmployeeId);
    //        if (employee == null || employee.EmployeeStatus != EmployeeStatusEnum.Active)
    //            throw new Exception("Inactive employee");

    //        var tz = GetTimeZoneForEmployee(dto.EmployeeId);
    //        var localTime = ToLocal(dto.TimestampUtc, tz).TimeOfDay;
    //        var session = GetSession(localTime);
    //        var date = DateOnly.FromDateTime(ToLocal(dto.TimestampUtc, tz));
    //        var action = dto.ForceOut ? AttendanceAction.Out : GetAction(dto.EmployeeId, session, date, dto.ForceOut ? 1 : 0);

    //        var log = new AttendanceLog
    //        {
    //            EmployeeId = dto.EmployeeId,
    //            DeviceSerial = dto.DeviceSerial ?? "MANUAL",
    //            DeviceStatus = dto.ForceOut ? 1 : 0,
    //            Session = session,
    //            Action = action,
    //            TimestampUtc = dto.TimestampUtc,
    //            IsManual = true,
    //            Notes = dto.Notes,
    //            CreatedByUserId = _userService.GetCurrentUserId()
    //        };

    //        _dataService.AttendanceLogs.Add(log);
    //        await _dataService.SaveAsync(cancellationToken);
    //        return log;
    //    }

    //    public async Task<List<AttendanceLogDto>> GetLogsAsync(DateTime? fromUtc, DateTime? toUtc, int? employeeId, int pageNumber, int pageSize)
    //    {
    //        var query = _dataService.AttendanceLogs.AsQueryable();

    //        if (employeeId.HasValue) query = query.Where(l => l.EmployeeId == employeeId.Value);
    //        if (fromUtc.HasValue) query = query.Where(l => l.TimestampUtc >= fromUtc.Value);
    //        if (toUtc.HasValue) query = query.Where(l => l.TimestampUtc <= toUtc.Value);

    //        return await query
    //            .OrderByDescending(l => l.TimestampUtc)
    //            .Skip((pageNumber - 1) * pageSize)
    //            .Take(pageSize)
    //            .Select(l => new AttendanceLogDto
    //            {
    //                Id = l.Id,
    //                EmployeeId = l.EmployeeId,
    //                EmployeeDisplayName = l.Employee != null ? l.Employee.DisplayName : string.Empty,
    //                DeviceSerial = l.DeviceSerial,
    //                TimestampUtc = l.TimestampUtc,
    //                Session = l.Session.ToString(),
    //                Action = l.Action.ToString(),
    //                IsManual = l.IsManual,
    //                Notes = l.Notes
    //            })
    //            .ToListAsync();
    //    }

    //    public async Task<List<DailyAttendanceSummaryDto>> GetDailySummaryAsync(DateOnly date, int? businessUnitId = null)
    //    {
    //        var fromUtc = date.ToDateTime(TimeSpan.Zero).ToUniversalTime();
    //        var toUtc = date.AddDays(1).ToDateTime(TimeSpan.Zero).ToUniversalTime();

    //        var query = _dataService.AttendanceLogs
    //            .Where(l => l.TimestampUtc >= fromUtc && l.TimestampUtc < toUtc);

    //        if (businessUnitId.HasValue)
    //            query = query.Where(l => l.Employee != null && l.Employee.BusinessUnitID == businessUnitId.Value);

    //        var logs = await query
    //            .Include(l => l.Employee)
    //            .ToListAsync();

    //        // Group by employee and compute summaries
    //        var summaries = logs.GroupBy(l => l.EmployeeId)
    //            .Select(g =>
    //            {
    //                var emp = g.First().Employee;
    //                var tz = GetTimeZoneForEmployee(g.Key);
    //                var localLogs = g.Select(l => new { Log = l, LocalTs = ToLocal(l.TimestampUtc, tz) }).ToList();

    //                var morningIn = localLogs.Where(ll => ll.Log.Session == AttendanceSession.Morning && ll.Log.Action == AttendanceAction.In)
    //                    .Min(ll => ll.LocalTs.TimeOfDay);
    //                var morningOut = localLogs.Where(ll => ll.Log.Session == AttendanceSession.Morning && ll.Log.Action == AttendanceAction.Out)
    //                    .Max(ll => ll.LocalTs.TimeOfDay);
    //                var afternoonIn = localLogs.Where(ll => ll.Log.Session == AttendanceSession.Afternoon && ll.Log.Action == AttendanceAction.In)
    //                    .Min(ll => ll.LocalTs.TimeOfDay);
    //                var afternoonOut = localLogs.Where(ll => ll.Log.Session == AttendanceSession.Afternoon && ll.Log.Action == AttendanceAction.Out)
    //                    .Max(ll => ll.LocalTs.TimeOfDay);

    //                var totalHours = (morningOut - morningIn ?? TimeSpan.Zero) + (afternoonOut - afternoonIn ?? TimeSpan.Zero);
    //                var late = (morningIn > _morningStart ? morningIn - _morningStart : TimeSpan.Zero) +
    //                           (afternoonIn > _afternoonStart ? afternoonIn - _afternoonStart : TimeSpan.Zero);
    //                var early = (_morningEnd > morningOut ? _morningEnd - morningOut : TimeSpan.Zero) +
    //                            (_afternoonEnd > afternoonOut ? _afternoonEnd - afternoonOut : TimeSpan.Zero);

    //                return new DailyAttendanceSummaryDto
    //                {
    //                    Date = date,
    //                    EmployeeId = g.Key,
    //                    EmployeeDisplayName = emp?.DisplayName ?? string.Empty,
    //                    MorningIn = morningIn,
    //                    MorningOut = morningOut,
    //                    AfternoonIn = afternoonIn,
    //                    AfternoonOut = afternoonOut,
    //                    TotalHours = totalHours,
    //                    LateMinutes = late,
    //                    EarlyLeaveMinutes = early,
    //                    IsAbsent = !localLogs.Any()
    //                };
    //            })
    //            .ToList();

    //        return summaries;
    //    }

    //    public async Task<List<DailyAttendanceSummaryDto>> GetMonthlySummaryAsync(int year, int month, int? employeeId = null)
    //    {
    //        var from = new DateOnly(year, month, 1);
    //        var to = from.AddMonths(1);

    //        var summaries = new List<DailyAttendanceSummaryDto>();
    //        for (var d = from; d < to; d = d.AddDays(1))
    //        {
    //            var daily = await GetDailySummaryAsync(d, null);  // Filter by employeeId if needed
    //            if (employeeId.HasValue)
    //                summaries.AddRange(daily.Where(s => s.EmployeeId == employeeId.Value));
    //            else
    //                summaries.AddRange(daily);
    //        }
    //        return summaries;
    //    }

    //    public async Task<Device> RegisterDeviceAsync(RegisterDeviceDto dto)
    //    {
    //        CancellationToken cancellationToken = CancellationToken.None;
    //        var device = new Device
    //        {
    //            SerialNumber = dto.SerialNumber,
    //            Model = dto.Model,
    //            IpAddress = dto.IpAddress,
    //            Location = dto.Location
    //        };
    //        _dataService.Devices.Add(device);
    //        await _dataService.SaveAsync(cancellationToken);
    //        return device;
    //    }

    //    public async Task<List<Device>> GetDevicesAsync()
    //    {
    //        return await _dataService.Devices.ToListAsync();
    //    }

    //    public async Task UpdateDeviceAsync(int id, bool isActive, string? location = null)
    //    {
    //        CancellationToken cancellationToken = CancellationToken.None;
    //        var device = await _dataService.Devices.FindAsync(id);
    //        if (device == null) throw new Exception("Device not found");
    //        device.IsActive = isActive;
    //        if (location != null) device.Location = location;
    //        await _dataService.SaveAsync(cancellationToken);
    //    }
    //}
}
