using CMS.Domain.Common;
using CMS.Domain.Enum;
using CMS.Domain.letters;
using CMS.Domain.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.LetterDocuments
{
        public class LetterDocument : AuditableEntity
        {
        public Guid Id { get; set; }
        public string FileName { get; set; } = default!;
        public string FilePath { get; set; } = default!;
        public string ContentType { get; set; } = default!;
        public string? Remark { get; set; } = default!;
        //Relation
        public int LetterId { get; set; }
            public Letter? Letter { get; set; }
        }
}
