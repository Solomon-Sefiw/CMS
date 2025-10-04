using CMS.Domain.Common;
using CMS.Domain.Enum;
using CMS.Domain.User;
using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.Payments
{
    public class Payment : AuditableEntity
    {
        [Key]
        public int Id { get; set; }
        public int CaseId { get; set; }
        public CMS.Domain.Cases.Case? Case { get; set; }
        public decimal Amount { get; set; }
        public string Gateway { get; set; } = string.Empty;
        public string? TransactionId { get; set; }
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        public string? ReceiptFilePath { get; set; }
        public string? ProcessedById { get; set; }
        public HRUser? ProcessedBy { get; set; }
        public DateTime? PaidAt { get; set; }
    }
}
