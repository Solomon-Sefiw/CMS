using CMS.Application.Features.UserAccount;
using CMS.Domain.User;
using CMS.Domain.User.UserNotification;
using CMS.Service.Models;
using CMS.Services.DataService;
using CMS.Services.EmailService;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CMS.ApplicationLayer.UserAccount
{
    public class UserAccountRegister : IUserAccount
    {
        private readonly UserManager<HRUser> _userManager;
        private readonly RoleManager<HRRole> _roleManager;
        private readonly IExchangeEmail _emailService;
        private readonly IDataService _dataservice;
        public UserAccountRegister(UserManager<HRUser> userManager
            , RoleManager<HRRole> roleManager, IExchangeEmail emailService, IDataService dataService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _emailService = emailService;
            _dataservice = dataService;
        }

        public async Task<NotifyResponse> CreateUser(UserRegisterDto registerDto)
        {

            var userExist = await _userManager.FindByEmailAsync(registerDto.Email);
            if (userExist != null)
            {
                return new NotifyResponse { Status = "Error", Message = "User Exist App" };

            }
            var user = new HRUser()
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                MiddleName = registerDto.MiddleName,
                LastName = registerDto.LastName,
                BranchId = registerDto.BranchId,
                EmailConfirmed = true,
                TwoFactorEnabled = true
            };

            var random = new Random();
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var password = new string(Enumerable.Repeat(chars, random.Next(8, 12))
                .Select(s => s[random.Next(s.Length)]).ToArray());

            while (!password.Any(char.IsDigit))
            {
                password = password + new string(Enumerable.Repeat("0123456789", random.Next(1, 3))
               .Select(s => s[random.Next(s.Length)]).ToArray());
            }
            var result = await _userManager.CreateAsync(user, password);

            if (registerDto.Roles?.Count() > 0)
            {
                var emailTemplete = await _dataservice.EmailTemplates
                .FirstOrDefaultAsync(a => a.EmailType == CMS.Domain.Enum.EmailTypeEnum.UserAccountRegisterNotificationEnum);
                if (!result.Succeeded)
                {
                    var errors = string.Join(Environment.NewLine, result.Errors.Select(e => e.Description));

                    return
                      new NotifyResponse { Status = "Error", Message = $"Failed to Create User!{Environment.NewLine}{errors}" };
                }
                await _userManager.AddToRolesAsync(user, registerDto.Roles);

                var populatedTemplate = emailTemplete.EmailMessage
                            .Replace("{userRegister.UserName}", registerDto.FirstName + registerDto.MiddleName )
                            .Replace("{userRegister.UserEmail} ", registerDto.Email)
                            .Replace("{userRegister.Password} ", password);

                var msg = new MessageDto
                {
                    Email = registerDto.Email,
                    EmailSubject = "Human Capital Management System User Crediential",
                    To = registerDto.FirstName + registerDto.MiddleName,
                    MessageContent = populatedTemplate.ToString(),
                };

                _emailService.SendEmails(msg);
                return new NotifyResponse { Status = "Success", Message = "Email Sent" };

            }
            return new NotifyResponse { Status = "Error", Message = $"Role {registerDto.Roles} Does Not Exist" };

        }

    }
}
