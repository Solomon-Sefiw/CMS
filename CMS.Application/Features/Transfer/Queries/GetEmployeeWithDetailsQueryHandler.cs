using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Application.Features.Transfer.Model;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Features.Transfer.Queries
{
    public class GetEmployeeWithDetailsQueryHandler : IRequestHandler<GetEmployeeWithDetailsQuery, EmployeeBasicInfoDto>
    {
        private readonly IDataService _dataService;
        public GetEmployeeWithDetailsQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<EmployeeBasicInfoDto> Handle(GetEmployeeWithDetailsQuery request, CancellationToken cancellationToken)
        {
            var employee = await _dataService.Employees
                .Include(e => e.BusinessUnits)
                .Include(e => e.Job)
                    .ThenInclude(j => j.JobRole)
                .FirstOrDefaultAsync(e => e.Id == request.EmployeeId, cancellationToken);

            if (employee == null)
            {
                return null;
            }
            return new EmployeeBasicInfoDto
            {
                Id = employee.Id,
                DisplayName = employee.DisplayName,
                BusinessUnitId = employee.BusinessUnitID,
                BusinessUnitName = employee.BusinessUnits?.Name,
                JobRoleId = employee.Job?.JobRoleId,
                JobRoleName = employee.Job?.JobRole?.RoleName
            };
        }
    }
}
