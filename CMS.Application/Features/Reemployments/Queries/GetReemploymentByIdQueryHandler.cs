using CMS.Application.Exceptions;
using CMS.Application.Features.Reemployments.Model;
using CMS.Domain.Employee;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace CMS.Application.Features.Reemployments.Queries
{
    public class GetReemploymentByIdQueryHandler : IRequestHandler<GetReemploymentByIdQuery, ReemploymentDto>
    {
        private readonly IDataService _dataService;

        public GetReemploymentByIdQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<ReemploymentDto> Handle(GetReemploymentByIdQuery request, CancellationToken cancellationToken)
        {
            var reemployment = await _dataService.Reemployments
                .Include(r => r.Employee)
                    .ThenInclude(e => e.BusinessUnits)
                .Include(r => r.Employee)
                    .ThenInclude(e => e.Job)
                        .ThenInclude(j => j.JobRole)
                .Where(r => r.Id == request.Id)
                   .Select(r => new ReemploymentDto
                   {
                       Id = r.Id,
                       EmployeeId = r.EmployeeId,
                       EmployeeName = r.Employee.DisplayName,
                       BusinessUnitName = r.Employee.BusinessUnits.Name,
                       JobRoleName = r.Employee.Job.JobRole.RoleName,
                       ReemploymentType = r.ReemploymentType,
                       ApprovalStatus = r.ApprovalStatus,
                       ReemploymentDate = r.ReemploymnetDate,
                       ReasonForReemployment = r.ReasonForReemploymnet,
                       Remark = r.Remark,
                       BusinessUnitId = r.Employee.BusinessUnits.Id, 
                       JobId = r.Employee.Job.JobRole.Id, 
                       EmployeeFirstName= r.Employee.FirstName,
                       EmployeeMiddleName=r.Employee.MiddleName,
                       EmployeeLastName= r.Employee.LastName,
                       AmharicFirstName= r.Employee.AmharicFirstName,
                       AmharicMiddleName=r.Employee.AmharicMiddleName,
                       AmharicLastName= r.Employee.AmharicLastName,
                       Gender = r.Employee.Gender,
                       MartialStatus = r.Employee.MartialStatus,
                       BirthDate = r.Employee.BirthDate,
                   })
                .FirstOrDefaultAsync(cancellationToken);

            if (reemployment == null)
                throw new NotFoundException(nameof(Reemployment), request.Id);

            return reemployment;
        }
    }

}
