using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Common;
using CMS.Domain.Enum;

namespace CMS.Domain.User
{
    public class UserDocument : AuditableSoftDeleteEntity
    {
        public int Id { get; set; }

        public DocumentType DocumentType { get; set; }
        public string DocumentId { get; set; }
        public string FileName { get; set; }
        //Relation
        public string UserId { get; set; }
        public HRUser User { get; set; }
    }
}
