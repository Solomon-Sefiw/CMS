using CMS.Domain.Cases;
using CMS.Domain.letters;
using CMS.Domain.Notifications;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CMS.Domain.User;

public class HRUser : IdentityUser
{

    public string? FirstName { get; set; }
    public string? MiddleName { get; set; }
    public string? LastName { get; set; }
    public int BranchId { get; set; }
    public bool IsDeactivated { get; set; }

    //public Branch Branch { get; set; }
    public virtual ICollection<UserRole> Roles { get; set; } = new List<UserRole>();
    public ICollection<Letter> SentLetters { get; set; }
    public ICollection<Letter> ReceivedLetters { get; set; }
    public ICollection<UserDocument> UserDocuments { get; set; }

    public virtual ICollection<Case> FiledCases { get; set; } = new List<Case>();
    public virtual ICollection<Case> AssignedCases { get; set; } = new List<Case>();
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}