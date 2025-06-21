using CMS.Domain.Common;

namespace CMS.Domain.Document
{
    public class Document : AuditableEntity
    {
        public string Id { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public string ContentDescription { get; set; }
        public long Length { get; set; }
        public byte[] Content { get; set; }
    }
}
