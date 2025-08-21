using CMS.Application.Features.Reemployments.Commands;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Reemployments.Handlers
{
    public class SubmitReemploymentCommandHandler : IRequestHandler<SubmitReemploymentCommand, int>
    {
        private readonly IDataService dataService;

        public SubmitReemploymentCommandHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<int> Handle(SubmitReemploymentCommand request, CancellationToken cancellationToken)
        {
            var reemployment = await dataService.Reemployments
                .FirstOrDefaultAsync(r => r.Id == request.ReemploymentId, cancellationToken);

            if (reemployment == null)
                throw new Exception("Reemployment record not found");

            reemployment.ApprovalStatus = ApprovalStatus.Submitted;
            reemployment.Remark = request.Remark;

            await dataService.SaveAsync(cancellationToken);

            return reemployment.Id;
        }
    }
}
