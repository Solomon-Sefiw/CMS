using CMS.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Payments.Models
{
    public class PaymentDto
    {
        public int Id { get; set; }
        public int CaseId { get; set; }
        public decimal Amount { get; set; }

        [JsonConverter(typeof(System.Text.Json.Serialization.JsonStringEnumConverter))]
        public PaymentGatewayType Gateway { get; set; }

        public string? TransactionId { get; set; }
        public string? ReceiptFilePath { get; set; }
        public string? ProcessedById { get; set; }
        public DateTime? PaidAt { get; set; }
        public string Status { get; set; } = "Pending";
    }
}
