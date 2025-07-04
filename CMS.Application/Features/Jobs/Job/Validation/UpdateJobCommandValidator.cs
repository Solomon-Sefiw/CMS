using FluentValidation;
using CMS.Application.Features.Jobs.Job.Command.UpdateJob;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Validation
{
    public class UpdateJobCommandValidator : AbstractValidator<UpdateJobCommand>
    {
        public UpdateJobCommandValidator()
        {
            RuleFor(x => x.businessunitId)
             .GreaterThan(0).WithMessage("Bussines unit required .");

            RuleFor(x => x.jobRoleId)
            .GreaterThan(0).WithMessage("Job role required .");
        }
    }
}
