using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Command.DeactivateJob
{
    public class DeactivateJobCommandHandler : IRequestHandler<DeactivateJobCommand, int>
    {
        private readonly IDataService _dataService;
        public DeactivateJobCommandHandler(IDataService dataService)
        {
            _dataService = dataService;    
        }
        public async Task<int> Handle(DeactivateJobCommand request, CancellationToken cancellationToken)
        {
            var deactivateJob = _dataService.Jobs.Where(j => j.Id == request.Id).FirstOrDefault();
            if (deactivateJob != null)
            {
                deactivateJob.JobStatus = JobStatus.InActive;
            }
            await _dataService.SaveAsync(cancellationToken);
            return deactivateJob.Id;
        }
    }
}
