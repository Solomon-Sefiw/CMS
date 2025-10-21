using CMS.Domain.Enum;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.EmployeeFileDocument.Dto
{
    public class CaseFileDocumentDto
    {

        public Guid Id { get; set; }
        public int CaseId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string CaseNumber { get; set; }
        public CaseDocumentType CaseDocumentType { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public byte[] FileContent { get; set; }  
        public DateTime? CreatedAt { get; set; }
        public string? FilePath { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? ModifiedBy { get; set; }
        public ApprovalStatus? ApprovalStatus { get; set; }
        public string Remark { get; set; }

    }
}
