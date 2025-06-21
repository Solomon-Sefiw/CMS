
using CMS.Domain.Enum;

namespace CMS.Application;

public class EmailNotification
{
    public string ToEmail { get; set; }
    public string ToName { get; set; }
    public string Subject { get; set; }
    public EmailTypeEnum EmailType { get; set; }
    public object Model { get; set; }
}

