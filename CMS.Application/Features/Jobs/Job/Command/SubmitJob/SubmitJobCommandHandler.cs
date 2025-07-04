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
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Command.SubmitJob
{
    public class SubmitJobCommandHandler : IRequestHandler<SubmitJobCommand, JobCreationResponse>
    {
        private readonly IDataService _dataService;
        private readonly INotificationService _notification;
        public SubmitJobCommandHandler(IDataService dataService, INotificationService notification)
        {
                _dataService = dataService;
            _notification = notification;
        }
        public async Task<JobCreationResponse> Handle(SubmitJobCommand request, CancellationToken cancellationToken)
        {
            var job = _dataService.Jobs.Where(j => j.Id == request.Id).FirstOrDefault();
            var businessUnit = await _dataService.BusinessUnits.FirstOrDefaultAsync(bu => bu.Id == job.BusinessUnitId, cancellationToken);

            var jobCount = await _dataService.Jobs.CountAsync(job => job.BusinessUnitId == job.BusinessUnitId, cancellationToken);
            bool jobCountExceeded = jobCount >= businessUnit.StaffStrength;

            if (jobCountExceeded!=null)
            {
                _notification.NotifyInfo("Job count has exceeded the staff strength for this business unit.");
            }
           
            if (job != null)
            {
                job.ApprovalStatus= ApprovalStatus.Submitted;
                job.Remark=request.Comment;
            }
            await _dataService.SaveAsync(cancellationToken);
            //return job.Id;
            return new JobCreationResponse { JobId = job.Id, JobCountExceeded = jobCountExceeded };
        }
    }
}
