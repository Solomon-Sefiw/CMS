using CMS.Domain;
using CMS.Domain.Courts;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using CMS.Domain.User;
using MediatR;
using System.ComponentModel.DataAnnotations;

namespace CMS.Application.Features.Employees
{
    public record CreateCaseReturnType(int id,Guid versionNumber);
    public class CreateCaseCommand:IRequest<CreateCaseReturnType>
    {
        public string CaseNumber { get; set; } 
        public CaseType CaseType { get; set; } 
        public CaseStatus Status { get; set; } 
        public string PlaintiffName { get; set; } 
        public string AccusedName { get; set; } 
        public string? Subject { get; set; }
        public DateTime FiledAt { get; set; } 
        public DateTime? ClosedAt { get; set; }
        public string FiledById { get; set; } 
        public string? AssignedJudgeId { get; set; }
        public int BusinessUnitId { get; set; }
        public int? ChilotId { get; set; }
    }
}
