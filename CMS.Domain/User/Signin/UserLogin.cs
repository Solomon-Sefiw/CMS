using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.User.Signin
{
    public class UserLogin
    {
        [EmailAddress]
        public string UserEmail { get; set; }
        public string Password { get; set; }
    }
}
