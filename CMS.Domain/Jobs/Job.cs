using CMS.Domain.Enum;

namespace CMS.Domain.Jobs
{
    public class Job
    {
        public int Id { get; set; }
        public int JobRoleId { get; set; }
        public int BusinessUnitId { get; set; }
        public bool IsVacant { get; set; } = true;
        public JobStatus JobStatus { get; set; } = JobStatus.Active;
        public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;
        public bool IsLocked { get; set; } = false; // We will use for locking after the job is Approved &  Assigned
        public BusinessUnit BusinessUnit { get; set; }
        public JobRole JobRole { get; set; }
        public string? Remark { get; set; }


    }
}
