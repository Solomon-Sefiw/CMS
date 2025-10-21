
using CMS.Domain.Enum;
using CMS.Services.DataService;
using MediatR;


namespace CMS.Application.Features.Cases.CaseDetail.Payments.Commands.UpdatePayment
{
    public class UpdatePaymentCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public decimal? Amount { get; set; }
        public PaymentGatewayType? Gateway { get; set; }
        public string? TransactionId { get; set; }
        public PaymentStatus? Status { get; set; }
        public DateTime? PaidAt { get; set; }
    }

    public class UpdatePaymentCommandHandler : IRequestHandler<UpdatePaymentCommand, bool>
    {
        private readonly IDataService _dataService;

        public UpdatePaymentCommandHandler(IDataService dataService) => _dataService = dataService;

        public async Task<bool> Handle(UpdatePaymentCommand request, CancellationToken cancellationToken)
        {
            var payment = await _dataService.Payments.FindAsync(request.Id);
            if (payment == null) return false;

            if (request.Amount.HasValue) payment.Amount = request.Amount.Value;
            if (request.Gateway.HasValue) payment.Gateway = request.Gateway.Value;
            if (!string.IsNullOrWhiteSpace(request.TransactionId)) payment.TransactionId = request.TransactionId;
            if (request.Status.HasValue) payment.Status = request.Status.Value;
            if (request.PaidAt.HasValue) payment.PaidAt = request.PaidAt.Value;
            await _dataService.SaveAsync(cancellationToken);

            return true;
        }
    }
}
