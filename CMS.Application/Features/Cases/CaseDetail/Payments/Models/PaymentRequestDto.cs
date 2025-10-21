using CMS.Domain.Enum;
using System.Text.Json.Serialization;
namespace CMS.Application.Features.Cases.CaseDetail.Payments.Models
{
    public class PaymentRequestDto
    {
        public int CaseId { get; set; }
        public decimal Amount { get; set; }

        [JsonConverter(typeof(System.Text.Json.Serialization.JsonStringEnumConverter))]
        public PaymentGatewayType Gateway { get; set; } = PaymentGatewayType.Generic;

        public string CallbackUrl { get; set; } = string.Empty;
        public string? Metadata { get; set; }
    }
}
