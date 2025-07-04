using AutoMapper;
using AutoMapper.QueryableExtensions;
using CMS.Application.Features.Jobs.JobGrades.Model;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.Probation
{
    public record GetAllProbationForNotificationQuery : IRequest<List<EmployeeDto>>;
    public class GetAllProbationForNotificationQueryHandler
     : IRequestHandler<GetAllProbationForNotificationQuery, List<EmployeeDto>>
    {
        private readonly IMapper _mapper;
        private readonly IDataService _dataService;

        public GetAllProbationForNotificationQueryHandler(IMapper mapper, IDataService dataService)
        {
            _mapper = mapper;
            _dataService = dataService;
        }

        public async Task<List<EmployeeDto>> Handle(GetAllProbationForNotificationQuery request, CancellationToken cancellationToken)
        {
            var employees = await _dataService.Employees
                .Where(e => e.EmployeeStatus == EmployeeStatusEnum.UnderProbation &&
                            e.ApprovalStatus == ApprovalStatus.Approved)
                .Include(e => e.BusinessUnits)
                .Include(e => e.Job)
                    .ThenInclude(j => j.JobRole)
                        .ThenInclude(r => r.JobCatagory)
                .ProjectTo<EmployeeDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            return employees;
        }
    }
}
