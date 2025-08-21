using CMS.Application.Features.Transfer.Commands;
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Transfer.Handlers
{
    public class SubmitTransferHandler : IRequestHandler<SubmitTransferCommand, int>
    {
        private readonly IDataService _dataService;
        public SubmitTransferHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<int> Handle(SubmitTransferCommand request, CancellationToken cancellationToken)
        {
            var transfer = await _dataService.EmployeeTransfers
                .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);

            if (transfer != null)
            {
                transfer.ApprovalStatus = ApprovalStatus.Submitted;
                transfer.Remark = request.Comment;
            }
            await _dataService.SaveAsync(cancellationToken);

            return transfer.Id;
        }
    }
}
