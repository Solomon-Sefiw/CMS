using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Payments.Models
{
    public class PaymentResponseDto
    {
        public bool Success { get; set; }
        public string? TransactionId { get; set; }
        public string? Message { get; set; }
        public string? RedirectUrl { get; set; }
    }

    public class PaymentStatusDto
    {
        public string TransactionId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Message { get; set; }
    }

    public class PaymentInitResultDto
    {
        public int PaymentId { get; set; }
        public string? TransactionId { get; set; }
        public string Gateway { get; set; } = string.Empty;
        public string? RedirectUrl { get; set; }
    }
}
