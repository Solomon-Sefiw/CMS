using AutoMapper;
using CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Models;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Employees.EmployeeActivities.Suspensions.Queries
{
    public record GetAllActiveSuspentionsQuery(int Id) : IRequest<SuspensionDto>;
    public class GetAllActiveSuspentionsQueryHandler : IRequestHandler<GetAllActiveSuspentionsQuery, SuspensionDto>
    {
        private readonly IDataService dataService;
        private readonly IMapper _mapper;
        public GetAllActiveSuspentionsQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            _mapper = mapper;
        }
        public async Task<SuspensionDto> Handle(GetAllActiveSuspentionsQuery query, CancellationToken cancellationToken)
        {
            var suspension = dataService.Suspensions
                .Where(d => d.IsActive == true && d.EmployeeId == query.Id).FirstOrDefault();
            var suspensionDto = _mapper.Map<SuspensionDto>(suspension);
            return suspensionDto;
        }
    }
}
