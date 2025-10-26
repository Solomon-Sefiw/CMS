using System.ComponentModel.DataAnnotations;
using CMS.Domain.Enum;
using CMS.Domain.LetterDocuments;
using CMS.Domain.User;

namespace CMS.Domain.letters
{
    //public class Letter : WorkflowEnabledEntity
    //{
    //    [Key]
    //    public int Id { get; set; }
    //    public string ReferenceNumber { get; set; }
    //    public string Subject { get; set; }
    //    public string Content { get; set; }
    //    public LetterType LetterType { get; set; }
    //    public LetterStatus Status { get; set; } = LetterStatus.pending;
    //    public DateTime? ReceivedDate { get; set; }
    //    public DateTime? SentDate { get; set; }
    //    public string? SenderId { get; set; }
    //    public HRUser Sender { get; set; }
    //    // Changed from RecipientId to RecipientIds to support multiple recipients
    //    public string RecipientIds { get; set; } // Store as JSON string, e.g., "[\"user1\", \"user2\"]"
    //    public List<HRUser> Recipients { get; set; } // Navigation property for recipients
    //    // New field for CC recipients (users or departments)
    //    public string CCRecipientIds { get; set; } // Store as JSON string, e.g., "[\"user1\", \"dept1\"]"
    //    public int BusinessUnitId { get; set; }
    //    public BusinessUnit BusinessUnits { get; set; }
    //    public ICollection<Domain.LetterDocument.LetterDocument> LetterDocuments { get; set; }
    //}


    public class Letter : WorkflowEnabledEntity
    {
        [Key]
        public int Id { get; set; }

        public string ReferenceNumber { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public LetterType LetterType { get; set; }
        public LetterStatus Status { get; set; } = LetterStatus.pending;
        public DateTime? ReceivedDate { get; set; }
        public DateTime? SentDate { get; set; }

        // Sender (single)
        public string? SenderId { get; set; }
        public HRUser Sender { get; set; }

        // Legacy single recipient (kept if you still use it)
        public string? RecipientId { get; set; }
        public HRUser Recipient { get; set; }

        // Many-to-many collections
        public ICollection<LetterRecipient> Recipients { get; set; } = new List<LetterRecipient>();
        public ICollection<LetterCC> CCRecipients { get; set; } = new List<LetterCC>();

        public int BusinessUnitId { get; set; }
        public BusinessUnit BusinessUnits { get; set; }

        public LetterDocument? LetterDocument { get; set; }

    }


    public class LetterRecipient
    {
        public int Id { get; set; }

        public int LetterId { get; set; }
        public Letter Letter { get; set; }

        public string RecipientId { get; set; }
        public HRUser Recipient { get; set; }
    }

    public class LetterCC
    {
        public int Id { get; set; }

        public int LetterId { get; set; }
        public Letter Letter { get; set; }

        // optional user CC
        public string? CCUserId { get; set; }
        public HRUser? CCUser { get; set; }

        // optional department CC
        public int? CCDepartmentId { get; set; }
        public BusinessUnit? CCDepartment { get; set; }
    }
}