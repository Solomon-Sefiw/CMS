using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Command.ActivateJob
{
    public class ActivateJobCommandHandler : IRequestHandler<ActivateJobCommand, int>
    {
        private readonly IDataService _dataService;
        public ActivateJobCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<int> Handle(ActivateJobCommand request, CancellationToken cancellationToken)
        {
            var activeJob = _dataService.Jobs.Where(j => j.Id == request.Id).FirstOrDefault();
            if (activeJob != null)
            {
                activeJob.JobStatus = JobStatus.Active;
            }
            await _dataService.SaveAsync(cancellationToken);
            return activeJob.Id;
        }
    }
}
