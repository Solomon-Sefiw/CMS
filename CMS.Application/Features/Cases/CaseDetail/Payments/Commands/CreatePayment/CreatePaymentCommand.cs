using AutoMapper;
using CMS.Domain.Payments;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Payments.Commands.CreatePayment
{
    public class CreatePaymentCommand : IRequest<int>
    {
        public int CaseId { get; set; }
        public decimal Amount { get; set; }
        public string Gateway { get; set; } = string.Empty;
        public string? TransactionId { get; set; }
        public string? ReceiptFilePath { get; set; }
        public string? ProcessedById { get; set; }
        public DateTime? PaidAt { get; set; }
        public CMS.Domain.Enum.PaymentStatus Status { get; set; } = CMS.Domain.Enum.PaymentStatus.Pending;
    }

    public class CreatePaymentCommandHandler : IRequestHandler<CreatePaymentCommand, int>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public CreatePaymentCommandHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<int> Handle(CreatePaymentCommand request, CancellationToken cancellationToken)
        {
            var entity = _mapper.Map<Payment>(request);

            // if status indicates paid and no PaidAt provided, set now
            if (entity.Status != CMS.Domain.Enum.PaymentStatus.Pending && !entity.PaidAt.HasValue)
            {
                entity.PaidAt = DateTime.UtcNow;
            }

            await _dataService.Payments.AddAsync(entity, cancellationToken);
            await _dataService.SaveAsync(cancellationToken);

            return entity.Id;
        }
    }
 }
