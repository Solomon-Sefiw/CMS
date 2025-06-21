

using Microsoft.AspNetCore.Identity;

namespace CMS.Domain.User
{
    public class HRRole  : IdentityRole<string>
    {
        public HRRole() : base()
        {

        }
        public string Description { get; set; }
        public string DisplayName { get; set; }

        public virtual ICollection<IdentityRoleClaim<string>> Claims { get; set; }


        public HRRole(string name, string displayName, string description) : base(name)
        {
            Id = Guid.NewGuid().ToString();
            Description = description;
            DisplayName = displayName;
        }
    }
}