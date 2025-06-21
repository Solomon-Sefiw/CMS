
using CMS.Domain.Enum;

namespace CMS.Application.Models
{
    public record ApprovalStatusTransition(ApprovalStatus From, ApprovalStatus To);
}
