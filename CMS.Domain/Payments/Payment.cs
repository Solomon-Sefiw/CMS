using CMS.Domain.Common;
using CMS.Domain.Enum;
using System;
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

        public PaymentGatewayType Gateway { get; set; } = PaymentGatewayType.Generic;

        public string? TransactionId { get; set; }
        public string? ReferenceNumber { get; set; }
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        public string? ReceiptFilePath { get; set; }

        public string? ProcessedById { get; set; }
        public CMS.Domain.User.HRUser? ProcessedBy { get; set; }
        public DateTime? PaidAt { get; set; }
    }
}
