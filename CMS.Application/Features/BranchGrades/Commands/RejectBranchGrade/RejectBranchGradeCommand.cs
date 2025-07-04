using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BranchGrades.Commands.RejectBranchGrade
{
    public record RejectBranchGradeCommand(int Id,string remark):IRequest<int>;

}
