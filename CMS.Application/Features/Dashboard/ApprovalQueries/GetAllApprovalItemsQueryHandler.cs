using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Dashboard.ApprovalQueries
{

    public class GetAllApprovalItemsQueryHandler : IRequestHandler<GetAllApprovalItemsQuery, PaginatedApprovalResult>
    {
        private readonly IDataService _dataService;

        public GetAllApprovalItemsQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<PaginatedApprovalResult> Handle(GetAllApprovalItemsQuery request, CancellationToken cancellationToken)
        {
            var now = DateTime.Now;
            const string submittedBy = "Set up maker";
            var submittedStatus = ApprovalStatus.Submitted;

            var items = new List<ApprovalItemDto>();

            items.AddRange(await _dataService.BusinessUnits
                .Where(b => b.ApprovalStatus == submittedStatus)
                .Select(b => new ApprovalItemDto("BU-" + b.Id, "BusinessUnit", b.Name, submittedBy, now, b.ApprovalStatus, "Business unit creation request"))
                .ToListAsync(cancellationToken));

            items.AddRange(await _dataService.Jobs
                .Where(j => j.ApprovalStatus == submittedStatus)
                .Select(j => new ApprovalItemDto("JOB-" + j.Id, "Job", j.JobRole.RoleName, submittedBy, now, j.ApprovalStatus, "Job creation request"))
                .ToListAsync(cancellationToken));

            items.AddRange(await _dataService.JobRoles
                .Where(jr => jr.ApprovalStatus == submittedStatus)
                .Select(jr => new ApprovalItemDto("JR-" + jr.Id, "JobRole", jr.RoleName, submittedBy, now, jr.ApprovalStatus, "Job role request"))
                .ToListAsync(cancellationToken));

            items.AddRange(await _dataService.JobRoleCatagories
                .Where(jrc => jrc.ApprovalStatus == submittedStatus)
                .Select(jrc => new ApprovalItemDto("JRC-" + jrc.Id, "Job-role-category", jrc.Name, submittedBy, now, jrc.ApprovalStatus, "Job role category request"))
                .ToListAsync(cancellationToken));

            items.AddRange(await _dataService.BenefitUnitPrices
                .Where(bup => bup.ApprovalStatus == submittedStatus)
                .Select(bup => new ApprovalItemDto("BUP-" + bup.Id, "Benefit-unit-price", bup.Price.ToString(), submittedBy, now, bup.ApprovalStatus, "Benefit unit price request"))
                .ToListAsync(cancellationToken));

            items.AddRange(await _dataService.BenefitValues
                .Where(bv => bv.ApprovalStatus == submittedStatus)
                .Select(bv => new ApprovalItemDto("BV-" + bv.Id, "Benefit-value", bv.Value.ToString(), submittedBy, now, bv.ApprovalStatus, "Benefit value request"))
                .ToListAsync(cancellationToken));

            items.AddRange(await _dataService.Benefits
                .Where(b => b.ApprovalStatus == submittedStatus)
                .Select(b => new ApprovalItemDto("BEN-" + b.Id, "Benefit", b.Name, submittedBy, now, b.ApprovalStatus, "Benefit request"))
                .ToListAsync(cancellationToken));

            items.AddRange(await _dataService.SubCities
                .Where(s => s.ApprovalStatus == submittedStatus)
                .Select(s => new ApprovalItemDto("SUB-" + s.Id, "Sub-city", s.Name, submittedBy, now, s.ApprovalStatus, "Sub-city setup request"))
                .ToListAsync(cancellationToken));

            items.AddRange(await _dataService.InstitutionNames
                .Where(i => i.ApprovalStatus == submittedStatus)
                .Select(i => new ApprovalItemDto("INST-" + i.Id, "Institution-name", i.Name, submittedBy, now, i.ApprovalStatus, "Institution setup request"))
                .ToListAsync(cancellationToken));

            items.AddRange(await _dataService.Awards
                .Where(a => a.ApprovalStatus == submittedStatus)
                .Select(a => new ApprovalItemDto("AWD-" + a.Id, "Award", a.Name, submittedBy, now, a.ApprovalStatus, "Award request"))
                .ToListAsync(cancellationToken));

            items.AddRange(await _dataService.EducationLevels
                .Where(e => e.ApprovalStatus == submittedStatus)
                .Select(e => new ApprovalItemDto("EDU-" + e.Id, "Education-level", e.Name, submittedBy, now, e.ApprovalStatus, "Education level request"))
                .ToListAsync(cancellationToken));

            items.AddRange(await _dataService.Employees
                .Where(e => e.ApprovalStatus == submittedStatus)
                .Select(e => new ApprovalItemDto("EMP-" + e.Id, "Employees", $"{e.FirstName} {e.LastName}", submittedBy, now, e.ApprovalStatus, "Employee profile request"))
                .ToListAsync(cancellationToken));

            var totalCount = items.Count;

            var pagedItems = items
                .OrderByDescending(i => i.SubmittedDate)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            return new PaginatedApprovalResult(
                Items: pagedItems,
                TotalCount: totalCount,
                PageNumber: request.PageNumber,
                PageSize: request.PageSize
            );
        }
    }

}
