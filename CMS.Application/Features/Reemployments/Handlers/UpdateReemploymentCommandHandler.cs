using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Reemployments.Handlers
{
    using global::CMS.Application.Features.Reemployments.Commands;
    using global::CMS.Domain.Enum;
    using global::CMS.Services.DataService;
    using MediatR;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Threading;
    using System.Threading.Tasks;

    namespace CMS.Application.Features.Reemployments.Handlers
    {
        public class UpdateReemploymentCommandHandler:IRequestHandler<UpdateReemploymentCommand, int>
        {
            private readonly IDataService dataService;

            public UpdateReemploymentCommandHandler(IDataService dataService)
            {
                this.dataService = dataService;
            }
            public async Task<int> Handle(UpdateReemploymentCommand request, CancellationToken cancellationToken)
            {
                var reemployment = await dataService.Reemployments
                    .FirstOrDefaultAsync(r => r.Id == request.ReemploymentId, cancellationToken);

                if (reemployment == null)
                    throw new Exception("Reemployment record not found");

                if (reemployment.ApprovalStatus != ApprovalStatus.Draft &&
                    reemployment.ApprovalStatus != ApprovalStatus.Rejected)
                {
                    throw new Exception("Only Draft or Rejected reemployment requests can be updated.");
                }

                reemployment.ReemploymnetDate = request.ReemploymentDate;
                reemployment.ReasonForReemploymnet = request.ReasonForReemployment;
                reemployment.Remark = request.Remark;
                reemployment.ReemploymentType = request.ReemploymentType;
                reemployment.ApprovalStatus = ApprovalStatus.Draft;

                await dataService.SaveAsync(cancellationToken);

                return reemployment.Id;
            }
        }
    }

}
