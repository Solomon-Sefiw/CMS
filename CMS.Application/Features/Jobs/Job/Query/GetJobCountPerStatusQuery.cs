using CMS.Domain.Enum;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Query
{
    public record JobCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);
    public record GetJobCountPerStatusQuery() : IRequest<JobCountsByStatus>;
   
}
