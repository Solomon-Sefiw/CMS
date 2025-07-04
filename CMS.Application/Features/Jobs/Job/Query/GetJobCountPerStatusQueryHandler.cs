using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Query
{
    public class GetJobCountPerStatusQueryHandler : IRequestHandler<GetJobCountPerStatusQuery, JobCountsByStatus>
    {
        private readonly IDataService _dataService;
        public GetJobCountPerStatusQueryHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<JobCountsByStatus> Handle(GetJobCountPerStatusQuery request, CancellationToken cancellationToken)
        {
            var approved = await _dataService.Jobs.Where(j => j.ApprovalStatus == ApprovalStatus.Approved).CountAsync();
            var approvalRequests = await _dataService.Jobs.Where(j => j.ApprovalStatus == ApprovalStatus.Submitted).CountAsync();
            var rejected = await _dataService.Jobs.Where(j => j.ApprovalStatus == ApprovalStatus.Rejected).CountAsync();
            var draft = await _dataService.Jobs.Where(j => j.ApprovalStatus == ApprovalStatus.Draft).CountAsync();
            return new(approved, approvalRequests, rejected, draft);
        }
    }
}
