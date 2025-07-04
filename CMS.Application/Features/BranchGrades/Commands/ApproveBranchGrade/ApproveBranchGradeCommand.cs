using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BranchGrades.Commands.ApproveBranchGrade
{
    public record ApproveBranchGradeCommand(int Id,string remark):IRequest<int>;

}
