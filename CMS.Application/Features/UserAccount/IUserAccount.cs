
using CMS.Application.Features.UserAccount;
using CMS.Domain.User.Signup;
using CMS.Domain.User.UserNotification;

namespace CMS.ApplicationLayer.UserAccount
{
    public interface IUserAccount
    {
        Task<NotifyResponse> CreateUser(UserRegisterDto registerDto);
    }
}
