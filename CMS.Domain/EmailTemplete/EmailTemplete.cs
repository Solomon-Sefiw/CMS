using CMS.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace CMS.Domain.EmailTemplet
{
    public class EmailTemplate  
    {
        [Key]
        public Guid Id { get; set; }
        public EmailTypeEnum EmailType { get; set; }
        public string EmailMessage { get; set; }
        public bool IsHtml { get; set; }

    }
}
