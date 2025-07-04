using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.BranchGrades.Commands.CreateBranchGrade
{
    public record AddBranchGradeCommand(string grade,int staffLimit,string description):IRequest<int>;
 
}
