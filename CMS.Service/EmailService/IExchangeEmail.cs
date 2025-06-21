using CMS.Service.Models;

namespace CMS.Services.EmailService
{
    public interface IExchangeEmail
    {
        Task<bool> SendEmails(MessageDto email);
        Task<bool> Send(int emailId);
    }
}
