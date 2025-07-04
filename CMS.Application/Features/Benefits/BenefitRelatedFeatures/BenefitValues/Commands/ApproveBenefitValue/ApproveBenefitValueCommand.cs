﻿using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitValues.Commands.ApproveBenefitValue
{
    public record ApproveBenefitValueCommand(int Id, string remark) : IRequest<int>;

}
