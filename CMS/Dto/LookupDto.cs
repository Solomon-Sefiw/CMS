using CMS.Application.Features.Benefits.BenefitRelatedFeatures.BenefitUnitOfMeasurement.Model;
using CMS.Application.Features.Benefits.Model;
using CMS.Application.Features.BusinessUnits.Queries;
using CMS.Application.Features.Jobs.JobRoles;
using CMS.Domain;
using CMS.Domain.BranchGrade;

namespace CMS.API.Dto
{
    public class LookupDto
    {
        public BusinessUnitLists BusinessUnits { get; set; }
        public List<BusinessUnitType> BusinessUnitTypes { get; set; }

        public List<JobRoleDto> JobRoles { get; set; }
        public List<JobCatagory> JobCatagories { get; set; }
        public List<JobRoleCategory> JobRoleCategories { get; set; }
        public List<JobGrade> JobGrades { get; set; }
        public List<BranchGrade> BranchGrades { get; set; }
        public List<BenefitDto> Benefits { get; set; }
        public List<BenefitDto> UnitPricedBenefits { get; set; }
        public List<BenefitUnitOfMeasurementDto> BenefitUnitOfMeasurements { get; set; }
    }
}
