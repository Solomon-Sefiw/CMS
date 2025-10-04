using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Payments.Models
{
    public class PaymentDto
    {
        public int Id { get; set; }
        public int CaseId { get; set; }
        public string? CaseNumber { get; set; }
        public decimal Amount { get; set; }
        public string Gateway { get; set; } = string.Empty;
        public string? TransactionId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? ReceiptFilePath { get; set; }
        public string? ProcessedById { get; set; }
        public string? ProcessedByName { get; set; }
        public DateTime? PaidAt { get; set; }
        public DateTime CreatedAt { get; set; } // from AuditableEntity
        public DateTime? ModifiedAt { get; set; } // from AuditableEntity
    }
}
