using CMS.Domain.Common;
using CMS.Domain.User;
using System.ComponentModel.DataAnnotations.Schema;

public class Message : AuditableEntity
{
    //public int CaseId { get; set; }
    //public CMS.Domain.Cases.Case? Case { get; set; }
    public int Id { get; set; }
    public string SenderId { get; set; }
    public HRUser Sender { get; set; }
    public string ReceiverId { get; set; }
    public HRUser Receiver { get; set; }
    public string Content { get; set; }
    public DateTime SentAt { get; set; } // When the message was sent
    public bool IsRead { get; set; } // Whether the message is read or not
}
