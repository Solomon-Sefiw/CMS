using CMS.Domain;
using CMS.Domain.Common;
using CMS.Domain.Enum;

namespace CMS.Domain.Employee
{
    public class EmployeeChangeLog : AuditableEntity, IEntity
    {
        public int Id { get; set; }
        public int EmployeeID { get; set; }
        public EmployeeChangeLogEntityType EntityType { get; set; }
        public int EntityId { get; set; }
        public ChangeType ChangeType { get; set; }
    }
}
