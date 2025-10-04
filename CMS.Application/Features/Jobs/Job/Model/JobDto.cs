using CMS.Domain.Enum;

namespace CMS.Application.Features.Jobs.Job.Model
{
    public class JobDto
    {
        public int Id { get; set; }
        public int JobRoleId { get; set; }
        public int BusinessUnitId { get; set; }
        public bool IsVacant { get; set; }
        public string JobRole { get; set; }
        public string BusinessUnit { get; set; }
        public string Vacant { get; set; }
        public JobStatus JobStatus { get; set; } 
        public ApprovalStatus ApprovalStatus { get; set; } 
        public bool IsLocked { get; set; }
        public bool IsJobCountExceed { get; set; }
        public string Locked { get; set; }
        public int? RequiredNumber { get; set; }


    }
}
