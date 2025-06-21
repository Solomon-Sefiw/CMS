using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CMS.Domain.Enum;

namespace CMS.Domain.Contacts
{
    public class Contact
    {
        public int Id { get; set; }
        public ContactTypeEnum Type { get; set; }
        public string Value { get; set; }
        public ContactCategoryEnum contactCategory { get; set; }

        //R/Ship
        public int RequestId { get; set; }
    }
}
