using CMS.Application.Features.BranchGrades.Queries;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Queries
{
    public record BenefitUnitOfMeasurementCountsByStatus(int Approved, int ApprovalRequests, int Rejected, int Drafts);

    public record GetBenefitUnitOfMeasurementCountPerStatusQuery() : IRequest<BenefitUnitOfMeasurementCountsByStatus>;


}
