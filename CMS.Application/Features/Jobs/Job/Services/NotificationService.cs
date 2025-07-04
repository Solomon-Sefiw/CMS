using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Services
{
    public class NotificationService : INotificationService
    {
        public void NotifyInfo(string message)
        {
            Console.WriteLine($"INFO: {message}");
        }
    }
}
