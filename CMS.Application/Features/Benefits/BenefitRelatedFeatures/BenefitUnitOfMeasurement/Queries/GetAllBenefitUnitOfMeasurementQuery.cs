
using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Model;
using CMS.Domain.Benefit;
using CMS.Domain.BranchGrade;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Queries
{
    public record GetAllBenefitUnitOfMeasurementQuery() : IRequest<List<BenefitUnitOfMeasurementDto>>;


}
