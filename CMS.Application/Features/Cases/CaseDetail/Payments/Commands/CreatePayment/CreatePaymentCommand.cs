using AutoMapper;
using CMS.Application.Features.Cases.CaseDetail.Payments.Models;
using CMS.Domain.Enum;
using CMS.Domain.Payments;
using CMS.Services.DataService;
using MediatR;

namespace CMS.Application.Features.Cases.CaseDetail.Payments.Commands.CreatePayment
{
    public class CreatePaymentCommand : IRequest<int>
    {
        public int CaseId { get; set; }
        public decimal Amount { get; set; }
        public PaymentGatewayType Gateway { get; set; } = PaymentGatewayType.Generic;
        public string? ReceiptFilePath { get; set; }
        public string? ProcessedById { get; set; }
        public DateTime? PaidAt { get; set; }
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
            var payment = _mapper.Map<Payment>(request);
            payment.Status = PaymentStatus.Pending;

            await _dataService.Payments.AddAsync(payment, cancellationToken);
            await _dataService.SaveAsync(cancellationToken);
            return payment.Id;
        }
    }
}
