using FluentValidation;
using CMS.Application.Features.Jobs.Job.Command.CreateJob;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Jobs.Job.Validation
{
    public class AddJobCommandValidator :AbstractValidator<AddJobCommand>
    {
        public AddJobCommandValidator()
        {
            RuleFor(x => x.businessunitId)
           .GreaterThan(0).WithMessage("Bussines unit required .");

            RuleFor(x => x.jobRoleId)
          .GreaterThan(0).WithMessage("Job role required .");
        }
    }
}
