
using CMS.Application.Features.Jobs.Job.JobUpdationCustomResponse;
using CMS.Application.Features.Jobs.Job.Services;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Command.UpdateJob
{
    public class UpdateJobCommandHandler : IRequestHandler<UpdateJobCommand, JobUpdationResponse>
    {
        private readonly IDataService _dataService;
        private readonly INotificationService _notificationService; 
        public UpdateJobCommandHandler(IDataService dataService,INotificationService notificationService)
        {
            _dataService= dataService;
            _notificationService = notificationService;
        }
        public async Task<JobUpdationResponse> Handle(UpdateJobCommand request, CancellationToken cancellationToken)
        {
            var job = _dataService.Jobs.Where(j => j.Id == request.jobId).FirstOrDefault();
            if (job != null)
            {
                if (job.IsLocked == false)
                {
                    job.BusinessUnitId = request.businessunitId;
                    job.JobRoleId = request.jobRoleId;
                    job.ApprovalStatus = ApprovalStatus.Draft;
                    job.IsVacant = true;
                    job.JobStatus = JobStatus.Active;
                    job.IsLocked = false;

                    await _dataService.SaveAsync(cancellationToken);
                    return new JobUpdationResponse { JobId = job.Id, IsLocked= false };
                }
                else
                {
                    _notificationService.NotifyInfo("Updation is not allowed once the job is assigned to employee ");
                    return new JobUpdationResponse { JobId = 0, IsLocked = true };
                }
            }
            else
            {
                return new JobUpdationResponse { JobId = 0, IsLocked = true };
            }
        }
    }
}
