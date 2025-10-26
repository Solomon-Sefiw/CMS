//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using CMS.Domain;
//using CMS.Domain.Enum;
//using CMS.Domain.User;

//namespace CMS.Application.Features.Letter.Models
//{
//    public class LetterDto
//    {
//        public int Id { get; set; }
//        public string ReferenceNumber { get; set; }
//        public string Subject { get; set; }
//        public string Content { get; set; }
//        public LetterType LetterType { get; set; }
//        public LetterStatus Status { get; set; }
//        public DateTime? ReceivedDate { get; set; }
//        public DateTime? SentDate { get; set; }
//        public string? SenderId { get; set; }
//        public HRUser Sender { get; set; }
//        public string? RecipientId { get; set; }
//        public HRUser Recipient { get; set; }
//        public int BusinessUnitId { get; set; }
//        public BusinessUnit BusinessUnits { get; set; }
//        public ICollection<Domain.LetterDocument.LetterDocument> LetterDocuments { get; set; }

//    }
//}


using CMS.Domain;
using CMS.Domain.Enum;
using CMS.Domain.LetterDocuments;
using CMS.Domain.letters;
using CMS.Domain.User;

public class LetterDto
{
    public int Id { get; set; }
    public string ReferenceNumber { get; set; }
    public string Subject { get; set; }
    public string Content { get; set; }
    public LetterType LetterType { get; set; }
    public LetterStatus Status { get; set; }
    public DateTime? ReceivedDate { get; set; }
    public DateTime? SentDate { get; set; }

    public string? SenderId { get; set; }
    public HRUser Sender { get; set; }

    public List<string> RecipientIds { get; set; } = new();
    public List<string> CCUserIds { get; set; } = new();
    public List<int> CCDepartmentIds { get; set; } = new();

    public ICollection<LetterRecipient> Recipients { get; set; } = new List<LetterRecipient>();
    public ICollection<LetterCC> CCUsers { get; set; } = new List<LetterCC>();
    public ICollection<LetterCC> CCDepartments { get; set; } = new List<LetterCC>();

    public int BusinessUnitId { get; set; }
    public BusinessUnit BusinessUnits { get; set; }
    public LetterDocument LetterDocument { get; set; }
}
