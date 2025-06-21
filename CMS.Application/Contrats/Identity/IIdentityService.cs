namespace CMS.Application
{
    public interface IIdentityService
    {
        Task<bool> AuthorizeAsync(string userId, string policyName);
        Task<bool> IsInRoleAsync(string userId, string v);
        Task<IList<string>> GetUserRoles(string userId);
        Task<bool> HasPermission(string userId, string name);
    }
}
