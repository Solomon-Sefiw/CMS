//using CMS.Domain.Common;
//using CMS.Domain.Enum;
//using System.ComponentModel.DataAnnotations;

//namespace CMS.Domain.Cases
//{
//    public class CaseDocument : AuditableSoftDeleteEntity
//    {
//        [Key]
//        public int Id { get; set; }
//        [Required]
//        public string FileName { get; set; } = string.Empty;
//        [Required]
//        public string FilePath { get; set; } = string.Empty;
//        public DocumentType DocumentType { get; set; } 
//      //  public CaseDocumentType CaseDocumentType { get; set; } = CaseDocumentType.Attachment;
//        public int PageCount { get; set; }
//        public bool IsVerified { get; set; } = false;
//        public string? UploadedById { get; set; }
//        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
//        public int CaseId { get; set; }
//        public CMS.Domain.Cases.Case? Case { get; set; }
//    }
//}
