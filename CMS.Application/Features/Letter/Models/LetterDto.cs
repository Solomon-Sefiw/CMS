using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;
using CMS.Domain.User;

namespace CMS.Application.Features.Letter.Models
{
    public class LetterDto
    {
        public int Id { get; set; }
        public string ReferenceNumber { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public LetterType LetterType { get; set; }
        public LetterStatus Status { get; set; }
        public DateTime ReceivedDate { get; set; }
        public DateTime? SentDate { get; set; }
        public string? SenderId { get; set; }
        public HRUser Sender { get; set; }
        public string? RecipientId { get; set; }
        public HRUser Recipient { get; set; }
    }
}
