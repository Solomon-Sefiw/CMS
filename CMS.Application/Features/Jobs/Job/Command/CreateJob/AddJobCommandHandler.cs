using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CMS.Service.Models;
using CMS.Application.Features.Jobs.Job.JobCreationCustomResponse;
using CMS.Application.Features.Jobs.Job.Services;
namespace CMS.Application.Features.Jobs.Job.Command.CreateJob
{
    public class AddJobCommandHandler : IRequestHandler<AddJobCommand, JobCreationResponse>
    {
        private readonly IDataService dataservice;
        private readonly INotificationService _notificationService;
        public AddJobCommandHandler(IDataService dataService,INotificationService notificationService)
        {
            this.dataservice = dataService;
            _notificationService = notificationService;
        }
        public async Task<JobCreationResponse> Handle(AddJobCommand command, CancellationToken cancellationToken)
        {

            var businessUnit = await dataservice.BusinessUnits.FirstOrDefaultAsync(bu => bu.Id == command.businessunitId, cancellationToken);
          
            var jobCount = await dataservice.Jobs.CountAsync(job => job.BusinessUnitId == command.businessunitId, cancellationToken);
            bool jobCountExceeded = jobCount >= businessUnit.StaffStrength;

            if (jobCountExceeded) 
            { _notificationService.NotifyInfo("Job count has exceeded the staff strength for this business unit.");
            }
            var newJob = new CMS.Domain.Jobs. Job()
            {
                JobRoleId = command.jobRoleId,
                BusinessUnitId = command.businessunitId,
            };
            await dataservice.Jobs.AddAsync(newJob);
            await dataservice.SaveAsync(cancellationToken);
            return new JobCreationResponse { JobId = newJob.Id, JobCountExceeded = jobCountExceeded };
        }
    }
}
