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
    public record ProbationSearchResult(List<EmployeeDto> Items, int TotalCount);
    public record GetProbationListQuery(EmployeeStatusEnum Status, int PageNumber, int PageSize) : IRequest<ProbationSearchResult>;
    public class GetProbationListQueryHandler : IRequestHandler<GetProbationListQuery, ProbationSearchResult>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataService;
        public GetProbationListQueryHandler(IMapper mapper, IDataService dataService)
        {
            this.mapper = mapper;
            this.dataService = dataService;
        }
        public async Task<ProbationSearchResult> Handle(GetProbationListQuery request, CancellationToken cancellationToken)
        {
            var employee = await dataService.Employees
                .Where(a => a.EmployeeStatus != Domain.Enums.EmployeeStatusEnum.Active &&
                a.ApprovalStatus == Domain.Enum.ApprovalStatus.Approved).Include(a => a.BusinessUnits)
                .Include(a => a.Job).ThenInclude(a => a.JobRole)
                               .ThenInclude(a => a.JobCatagory)
                .ProjectTo<EmployeeDto>(mapper.ConfigurationProvider).ToListAsync();


            if (request.Status == EmployeeStatusEnum.ProbationApprovalRequest)
            {
                var result = employee.Where(emp => emp.EmployeeStatus == EmployeeStatusEnum.ProbationApprovalRequest)
                                                .Skip((request.PageNumber - 1) * request.PageSize)
                                                .Take(request.PageSize)
                                                .ToList();

                var count = await dataService.
                    Employees.Where(emp => emp.EmployeeStatus == EmployeeStatusEnum.ProbationApprovalRequest).CountAsync();
                return new(result, count);
            }
            else if (request.Status == EmployeeStatusEnum.UnderProbation)
            {
                var result = employee.Where(emp =>emp.EmployeeStatus == EmployeeStatusEnum.UnderProbation)
                                            .Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize)
                                            .ToList();
                var count = await dataService.Employees.Where(emp =>
                        emp.EmployeeStatus == EmployeeStatusEnum.UnderProbation).CountAsync();
                return new(result, count);
            }
            else if (request.Status == EmployeeStatusEnum.ProbationApprovalRejected)
            {
                var result = employee.Where(emp => emp.EmployeeStatus == EmployeeStatusEnum.ProbationApprovalRejected)
                                            .Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize)
                                            .ToList();
                var count = await dataService.Employees.Where(emp =>
                        emp.EmployeeStatus == EmployeeStatusEnum.ProbationApprovalRejected).CountAsync();
                return new(result, count);
            }
            return null;
        }
    }
}
