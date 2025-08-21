
namespace CMS.Domain.Employee
{
    public class EmployeeComment
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string CommentType { get; set; }
        public string CommentedByUserId { get; set; }

        public string CommentedBy { get; set; }
        public string Text { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;

        public Employee Employee { get; set; }
    }
}
