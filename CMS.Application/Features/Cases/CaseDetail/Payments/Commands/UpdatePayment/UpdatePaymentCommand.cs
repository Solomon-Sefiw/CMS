using AutoMapper;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Payments.Commands.UpdatePayment
{
    public class UpdatePaymentCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public string Gateway { get; set; } = string.Empty;
        public string? TransactionId { get; set; }
        public string? ReceiptFilePath { get; set; }
        public string? ProcessedById { get; set; }
        public DateTime? PaidAt { get; set; }
        public CMS.Domain.Enum.PaymentStatus Status { get; set; } = CMS.Domain.Enum.PaymentStatus.Pending;
    }

    public class UpdatePaymentCommandHandler : IRequestHandler<UpdatePaymentCommand, bool>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public UpdatePaymentCommandHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<bool> Handle(UpdatePaymentCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dataService.Payments
                .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

            if (entity == null) return false;

            _mapper.Map(request, entity);

            // If status moved to paid and PaidAt not set, stamp time
            if (entity.Status != CMS.Domain.Enum.PaymentStatus.Pending && !entity.PaidAt.HasValue)
            {
                entity.PaidAt = DateTime.UtcNow;
            }

            _dataService.Payments.Update(entity);
            await _dataService.SaveAsync(cancellationToken);
            return true;
        }
    }
}
