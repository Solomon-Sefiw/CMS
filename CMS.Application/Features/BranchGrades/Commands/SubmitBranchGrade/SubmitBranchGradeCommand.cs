using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BranchGrades.Commands.SubmitBranchGrade
{
    public record SubmitBranchGradeCommand(int Id, string remark) : IRequest<int>;

}
