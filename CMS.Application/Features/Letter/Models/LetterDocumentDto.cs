using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Letter.Models
{
    public class LetterDocumentDto
    {
        public Guid Id { get; set; }
        public int LetterId { get; set; }
        public string FileName { get; set; } = default!;
        public string FilePath { get; set; } = default!;
        public string ContentType { get; set; } = default!;
        public string? Remark { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? FullPhysicalPath { get; set; }
    }
}
