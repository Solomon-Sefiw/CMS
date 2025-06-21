using CMS.Domain.letters;
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
}