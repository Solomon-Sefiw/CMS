using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Model;
using CMS.Application.Features.BranchGrades.Model;
using CMS.Domain.Enum;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Queries
{

    public record BenefitUnitOfMeasurementSearchResult(List<BenefitUnitOfMeasurementDto> Items, int TotalCount);
    public record GetBenefitUnitOfMeasurementListForPaginationQuery(ApprovalStatus Status, int PageNumber, int PageSize) : IRequest<BenefitUnitOfMeasurementSearchResult>;

}
