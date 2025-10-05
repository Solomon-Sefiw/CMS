using AutoMapper;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Models;
using CMS.Application.Features.Employees.EmployeeActivities.Resignations.Models;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.Resignations.Queries
{


    public record GetAllActiveResignationsQuery(int Id) : IRequest<ResignationDto>;
    public class GetAllActiveResignationsQueryHandler : IRequestHandler<GetAllActiveResignationsQuery, ResignationDto>
    {
        private readonly IDataService dataService;
        private readonly IMapper _mapper;

        public GetAllActiveResignationsQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            _mapper = mapper;
        }
        public async Task<ResignationDto> Handle(GetAllActiveResignationsQuery query, CancellationToken cancellationToken)
        {
            var acting = dataService.Resignations
                .Where(d => d.IsActive == true && d.EmployeeId == query.Id).FirstOrDefault();
            var regionDtos = _mapper.Map<ResignationDto>(acting);
            return regionDtos;

        }
    }
}
