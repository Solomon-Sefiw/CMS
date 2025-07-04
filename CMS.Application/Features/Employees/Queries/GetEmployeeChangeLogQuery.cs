using AutoMapper;
using AutoMapper.QueryableExtensions;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.Queries
{
    public record EmployeeChangeLogDto(int Id, int EmployeeId, EmployeeChangeLogEntityType EntityType, int EntityId, ChangeType ChangeType);

    public record GetEmployeeChangeLogQuery(int EmployeeId) : IRequest<List<EmployeeChangeLogDto>>;


    public class GetEmployeeChangeLogQueryHandler : IRequestHandler<GetEmployeeChangeLogQuery, List<EmployeeChangeLogDto>>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;

        public GetEmployeeChangeLogQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }
        public async Task<List<EmployeeChangeLogDto>> Handle(GetEmployeeChangeLogQuery request, CancellationToken cancellationToken)
        {
            var result = await dataService.EmployeeChangeLogs
                .Where(l => l.EmployeeID == request.EmployeeId).ProjectTo<EmployeeChangeLogDto>(mapper.ConfigurationProvider).ToListAsync();
            return result;
        }
    }
}
