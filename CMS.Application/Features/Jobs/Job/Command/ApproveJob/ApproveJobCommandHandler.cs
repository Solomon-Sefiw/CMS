using CMS.Application.Features.Jobs.Job.JobCreationCustomResponse;
using CMS.Application.Features.Jobs.Job.Services;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace CMS.Application.Features.Jobs.Job.Command.ApproveJob
{
    public class ApproveJobCommandHandler : IRequestHandler<ApproveJobCommand, JobCreationResponse>
    {
        private readonly IDataService _dataService;
        private readonly INotificationService notification;
        public ApproveJobCommandHandler(IDataService dataService, INotificationService _notification)
        {
            _dataService= dataService;
            notification = _notification;
        }
        public async Task<JobCreationResponse> Handle(ApproveJobCommand request, CancellationToken cancellationToken)
        {
            var job = _dataService.Jobs.Where(j => j.Id == request.Id).FirstOrDefault();
            var businessUnit = await _dataService.BusinessUnits.FirstOrDefaultAsync(bu => bu.Id == job.BusinessUnitId, cancellationToken);

            var jobCount = await _dataService.Jobs.CountAsync(job => job.BusinessUnitId == job.BusinessUnitId, cancellationToken);
            bool jobCountExceeded = jobCount >= businessUnit.StaffStrength;

            if (jobCountExceeded)
            {
                notification.NotifyInfo("Job count has exceeded the staff strength for this business unit.");
            }
            if (job != null)
            {
                job.ApprovalStatus = ApprovalStatus.Approved;
                job.Remark=request.Comment;
            }
            await _dataService.SaveAsync(cancellationToken);
           // return job.Id;
            return new JobCreationResponse { JobId = job.Id, JobCountExceeded = jobCountExceeded };
        }
    }
}
