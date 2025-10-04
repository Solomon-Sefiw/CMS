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
    public class RejectTransferHandler : IRequestHandler<RejectTransferCommand, int>
    {
        private readonly IDataService _dataService;
        public RejectTransferHandler(IDataService dataService)
        {
            _dataService = dataService;
        }
        public async Task<int> Handle(RejectTransferCommand request, CancellationToken cancellationToken)
        {
            var transfer = await _dataService.EmployeeTransfers
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (transfer != null)
            {
                transfer.ApprovalStatus = ApprovalStatus.Rejected;
                transfer.Remark = request.Comment;
            }    
            await _dataService.SaveAsync(cancellationToken);
            return transfer.Id;
        }
    }
}
