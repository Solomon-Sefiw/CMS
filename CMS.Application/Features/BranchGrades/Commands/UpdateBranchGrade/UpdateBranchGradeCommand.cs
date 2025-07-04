using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BranchGrades.Commands.UpdateBranchGrade
{
    public record UpdateBranchGradeCommand(int Id, string grade, int staffLimit, string description):IRequest<int>;
 
}
