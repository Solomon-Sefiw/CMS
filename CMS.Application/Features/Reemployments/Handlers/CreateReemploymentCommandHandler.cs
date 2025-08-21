using AutoMapper;
using CMS.Application.Features.Reemployments.Commands;
using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Reemployments.Handlers
{
    public class CreateReemploymentCommandHandler : IRequestHandler<CreateReemploymentCommand, int>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;
        private readonly IMediator mediator;

        public CreateReemploymentCommandHandler(IDataService dataService, IMapper mapper, IMediator mediator)
        {
            this.dataService = dataService;
            this.mapper = mapper;
            this.mediator = mediator;
        }

        public async Task<int> Handle(CreateReemploymentCommand request, CancellationToken cancellationToken)
        {
            var reEmployeeExist = await dataService.Reemployments.Where(a => a.EmployeeId == request.EmployeeId).FirstOrDefaultAsync();
            if (reEmployeeExist != null)
            {
                throw new Exception("Re-Employment record exist!");
            }
            var reemployment = new Reemployment
            {
                EmployeeId = request.EmployeeId,
                ReemploymentType = request.ReemploymentType,
                ReemploymnetDate = request.ReemploymentDate,
                ReasonForReemploymnet = request.ReasonForReemployment,
                Remark = request.Remark,
                ApprovalStatus = ApprovalStatus.Draft 
            };

            dataService.Reemployments.Add(reemployment);
            await dataService.SaveAsync(cancellationToken);

            return reemployment.Id;
        }
    }
}
