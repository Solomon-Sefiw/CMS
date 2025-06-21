using CMS.Domain.Common;
using CMS.Domain.EmailTemplet;

namespace CMS.Domain
{
    public class Email : AuditableEntity
    {
        public int Id { get; set; }
        public Guid EmailTemplateId { get; set; }
        public string Subject { get; set; }
        public string ToEmail { get; set; }
        public string ToName { get; set; }
        public string Body { get; set; }
        public bool IsHtml { get; set; }
        public bool Sent { get; set; }

        public EmailTemplate EmailTemplate { get; set; }
    }
}
