﻿using System.ComponentModel.DataAnnotations;
using CMS.Domain.Enum;
using CMS.Domain.User;

namespace CMS.Domain.letters
{
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
        public string? SenderId { get; set; }
        public HRUser Sender { get; set; }
        public string? RecipientId { get; set; }
        public HRUser Recipient { get; set; }
        public int BusinessUnitId { get; set; }
        public BusinessUnit BusinessUnits { get; set; }
        public ICollection<Domain.LetterDocument.LetterDocument> LetterDocuments { get; set; }

        public bool IsEditableDocument { get; set; }
        public string? DocumentJsonContent { get; set; }

    }
}
