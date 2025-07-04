using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Command.RejectJob
{
    public class RejectJobCommandHandler : IRequestHandler<RejectJobCommand, int>
    {
        private readonly IDataService _dataService;
        public RejectJobCommandHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<int> Handle(RejectJobCommand request, CancellationToken cancellationToken)
        {
          var job = _dataService.Jobs.Where(j=>j.Id == request.Id).FirstOrDefault();

            if (job != null)
            {
                job.ApprovalStatus = ApprovalStatus.Rejected;
                job.Remark=request.Comment;
            }
            await _dataService.SaveAsync(cancellationToken);
            return job.Id;
        }
    }
}
