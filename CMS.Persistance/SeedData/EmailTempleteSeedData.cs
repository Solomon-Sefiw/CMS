using CMS.Domain.EmailTemplet;
using CMS.Domain.Enum;
using CMS.Persistance.DBContext;
using Microsoft.EntityFrameworkCore;

namespace CMS.Persistance.SeedData
{
    public class EmailTempleteSeedData
    {
        public static async Task SeedAsync(CMSDBContext dbContext)
        {
            foreach (var template in EmailTemplates)
            {
                var _template = await dbContext.EmailTemplates.FirstOrDefaultAsync(t => t.EmailType == template.EmailType);
                if (_template == null)
                {
                    dbContext.EmailTemplates.Add(template);
                }
                else if (template.EmailMessage != _template.EmailMessage)
                {
                    _template.EmailMessage = template.EmailMessage;
                }
            }
        }

        private static List<EmailTemplate> EmailTemplates => new List<EmailTemplate>()
        {
            new EmailTemplate()
            {
                Id = Guid.NewGuid(),
                EmailType = EmailTypeEnum.UserAccountRegisterNotificationEnum,
                EmailMessage = $"<br>Dear <strong>{{userRegister.UserName}}</strong>,<br><br>\r\nHuman Capital Management System User has been created!<br>\r\nUserName: <strong>{{userRegister.UserEmail}} </strong><br>\r\nPassword: <strong>{{userRegister.Password}} </strong><br><br>\r\nNote: This is a trial email testing for the Human Capital Management System!\r\n"
            },
              new EmailTemplate()
              {
                  Id = Guid.NewGuid(),
                  EmailType = EmailTypeEnum.UserLoginNotificationEnum,
                  EmailMessage = $"<br>Dear <strong>{{userRegister.UserName}}</strong>, <br><br>\r\nPlease use the below verification code to complete your sign-in process!<br>\r\nVerification Code: <strong>{{userRegister.UserEmail}} </strong><br><br>\r\nNote: This is a trial email testing for the Human Capital Management System!<br>"
              },
              new EmailTemplate()
            {
                EmailType = EmailTypeEnum.AppUserCreated,
                EmailMessage = @"<html style=""font-family: Arial, sans-serif, 'Open Sans'""><body> <p>Hi {{Name}},</p> <p> We would like to confirm that your Human Capital Management System (CMS) portal account has successfully been created. To access the portal click the link below. </p> <p> <a href=""{{SmsUrl}}"">{{SmsUrl}}</a> </p> <p> Your temporary password is: <strong>{{TempPassword}}</strong> </p> <p> If you experience any issues please reach out our support team. <br /> <p> Regards, <br /> CMS team </p></body></html>",
                IsHtml = true
            },
               new EmailTemplate{
                EmailType= EmailTypeEnum.AuthenticationCode,
                EmailMessage = @"<html style=""font-family: Arial, sans-serif, 'Open Sans'""><body><p>Hi {{Name}},</p><p> Please use the below verification code to complete your sign in process.</p><p style=""font-weight:bold;font-size: 125%""> {{Code}} </p><p> Please do not share this code with anyone.</p><p> If you experience any issues please reach out our support team. <br /><p> Regards, <br /> CMS team </p></body></html>",
                IsHtml=true
            },
            new EmailTemplate{
                EmailType= EmailTypeEnum.PasswordChanged,
                EmailMessage = @"<html style=""font-family: Arial, sans-serif, 'Open Sans'""><body><p>Hi {{Name}},</p><p> Your CMS password was recently changed. If you requested this change, you can ignore this email. Otherwise, please contact the CMS Team. <br /><p> Regards, <br /> CMS team </p></body></html>",
                IsHtml=true
            },
            new EmailTemplate{
                EmailType= EmailTypeEnum.ForgotPassword,
                EmailMessage = @"<html style=""font-family: Arial, sans-serif, 'Open Sans'""><body><p>Hi {{Name}},</p><p>You recently initiated a password reset for your CMS account. Please click the link below to reset your password. </p><br /><p> <a style=""font-weight:bold;font-size: 125%"" href=""{{Url}}"">Reset Password</a></p><br/> <p>If you did not initiate a password reset please contact us.</p><br /><p> Regards, <br /> SMS team </p> </body></html>",
                IsHtml=true
            },

        };
        

    }
}
