// 2. In your MediatR Queries file (e.g., Application/Features/Employees/Queries/GetEmployeeListWithPaginationQuery.cs)
// Assuming CMS.Domain.Enum is in CMS.Domain.Enum;
// Assuming CMS.Services.DataService is in CMS.Services.DataService;

using CMS.Domain.Enum; // Make sure this is imported
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic; // Added for List
using System.Linq; // Added for Where, Skip, Take

namespace CMS.Application.Features.Employees.Queries
{
    // Make sure EmployeeDto is defined and accessible in this namespace or imported
    // For example, if EmployeeDto is in a different namespace:
    // using CMS.Application.Features.Employees.Models; // Example path

    public record EmployeeSearchResult(List<EmployeeDto> Items, int TotalCount);

    // <--- MODIFIED: Added string? SearchQuery to the record
    public record GetEmployeeListWithPaginationQuery(int BusinessUnitId, ApprovalStatus Status, int PageNumber, int PageSize, string? SearchQuery) : IRequest<EmployeeSearchResult>;

    public class GetEmployeeListWithPaginationQueryHandler : IRequestHandler<GetEmployeeListWithPaginationQuery, EmployeeSearchResult>
    {
        private readonly IDataService _dataService;

        public GetEmployeeListWithPaginationQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<EmployeeSearchResult> Handle(GetEmployeeListWithPaginationQuery query, CancellationToken cancellationToken)
        {
            var employeeQuery = _dataService.Employees.AsQueryable();

            // Apply Business Unit filter
            if (query.BusinessUnitId > 1)
            {
                employeeQuery = employeeQuery.Where(b => b.BusinessUnitID == query.BusinessUnitId);
            }

            // Apply Approval Status filter
            employeeQuery = employeeQuery.Where(b => b.ApprovalStatus == query.Status);

            // <--- ADDED: Search Query Filter
            if (!string.IsNullOrWhiteSpace(query.SearchQuery))
            {
                var lowerCaseSearchQuery = query.SearchQuery.ToLower();
                employeeQuery = employeeQuery.Where(emp =>
                    (emp.DisplayName != null && emp.DisplayName.ToLower().Contains(lowerCaseSearchQuery)) ||
                    (emp.Job != null && emp.Job.JobRole != null && emp.Job.JobRole.RoleName != null && emp.Job.JobRole.RoleName.ToLower().Contains(lowerCaseSearchQuery)) || // Assuming Job and JobRole are navigatable properties and have RoleName
                    (emp.BusinessUnits != null && emp.BusinessUnits.Name != null && emp.BusinessUnits.Name.ToLower().Contains(lowerCaseSearchQuery)) || // Assuming BusinessUnit is navigatable and has Name property
                    emp.EmployeeId.ToString().Contains(lowerCaseSearchQuery)
                );
            }
            // End of Search Query Filter ---^

            var totalCount = await employeeQuery.CountAsync(cancellationToken); // Count *after* all filters (including search)

            var paginatedEmployees = await employeeQuery
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync(cancellationToken);

            var businessUnits = await _dataService.BusinessUnits.ToDictionaryAsync(bu => bu.Id, cancellationToken);
            var jobRoles = await _dataService.JobRoles.ToDictionaryAsync(jr => jr.Id, cancellationToken);
            var jobs = await _dataService.Jobs.ToDictionaryAsync(j => j.Id, cancellationToken);

            // Map results to DTOs
            var employeeDtos = paginatedEmployees.Select(emp =>
            {
                var businessUnit = businessUnits.GetValueOrDefault(emp.BusinessUnitID);
                var job = jobs.GetValueOrDefault(emp.JobId);
                var jobTitle = job != null ? jobRoles.GetValueOrDefault(job.JobRoleId) : null;

                return new EmployeeDto
                {
                    Id=emp.Id,
                    FirstName = emp.FirstName,
                    MiddleName = emp.MiddleName,
                    LastName = emp.LastName,
                    DisplayName = emp.DisplayName,
                    AmharicFirstName = emp.AmharicFirstName,
                    AmharicMiddleName = emp.AmharicMiddleName,
                    AmharicLastName = emp.AmharicLastName,
                    AmharicDisplayName = emp.AmharicDisplayName,
                    EmployeeId = emp.EmployeeId,
                    BusinessUnit = businessUnit?.Name,
                    JobTitle = jobTitle?.RoleName,
                    JobId = emp.JobId,
                    BirthDate = emp.BirthDate,
                    EmployementDate = emp.EmployementDate,
                    MartialStatus = emp.MartialStatus,
                    Gender = emp.Gender,
                    VersionNumber = emp.VersionNumber,
                    ApprovalStatus = emp.ApprovalStatus,
                    IsNew = emp.IsNew,
                    EmployeeStatus = emp.EmployeeStatus,
                    Job = emp.Job, // Assuming this is directly mappable
                    WorkflowComment = emp.WorkflowComment
                };
            }).ToList();

            return new EmployeeSearchResult(employeeDtos, totalCount);
        }
    }


}