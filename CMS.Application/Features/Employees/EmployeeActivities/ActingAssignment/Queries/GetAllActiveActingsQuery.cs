using AutoMapper;
using CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Models;
using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Employees.EmployeeActivities.ActingAssignment.Queries
{
    public record GetAllActiveActingsQuery(int Id) : IRequest<ActingDto>;
    public class GetAllActiveActingsQueryHandler : IRequestHandler<GetAllActiveActingsQuery, ActingDto>
    {
        private readonly IDataService dataService;
        private readonly IMapper _mapper;

        public GetAllActiveActingsQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            _mapper = mapper;
        }
        public async Task<ActingDto> Handle(GetAllActiveActingsQuery query, CancellationToken cancellationToken)
        {
            var acting = dataService.Actings
                .Where(d => d.IsActive == true && d.EmployeeId == query.Id).FirstOrDefault();
            var regionDtos = _mapper.Map<ActingDto>(acting);
            return regionDtos;
            
        }
    }
}