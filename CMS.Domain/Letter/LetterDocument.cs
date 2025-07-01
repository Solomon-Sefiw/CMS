using CMS.Domain.Common;
using CMS.Domain.Enum;
using CMS.Domain.letters;
using CMS.Domain.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.LetterDocument
{
        public class LetterDocument : AuditableSoftDeleteEntity
        {
            public int Id { get; set; }

            public DocumentType DocumentType { get; set; }
            public string DocumentId { get; set; }
            public string FileName { get; set; }
            public bool IsImage { get; set; }
        //Relation
        public int LetterId { get; set; }
            public Letter Letter { get; set; }



        }
}
