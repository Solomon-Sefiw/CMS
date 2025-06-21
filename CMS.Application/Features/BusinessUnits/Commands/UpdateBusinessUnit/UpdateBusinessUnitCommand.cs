using CMS.Domain.Enum;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BusinessUnits.Commands.UpdateBusinessUnit
{
    public class UpdateBusinessUnitCommand : IRequest<int>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ParentId { get; set; }
        public BusinessUnitTypeEnum Type { get; set; }
        public int? StaffStrength { get; set; }
        public int? BranchGradeId { get; set; }
        //  public ApprovalStatus ApprovalStatus { get; set; }
    }
}
