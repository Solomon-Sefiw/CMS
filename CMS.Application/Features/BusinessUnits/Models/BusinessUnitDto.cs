
using CMS.Domain;
using CMS.Domain.Adress;
using CMS.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace CMS.Application.Features.BusinessUnits
{
    public class BusinessUnitDto
    {

        public int Id { get; set; }
        public string BusinessUnitID { get; set; }
        public string Name { get; set; }
        public string? ParentBusinessUnitName { get; set; }
        public int ParentId { get; set; }
        public string BusinessUnitTypeName { get; set; }
        public BusinessUnitTypeEnum Type { get; set; }
        public string BusinessUnitCode { get; set; }
        public int? StaffStrength { get; set; }

        public ApprovalStatus ApprovalStatus { get; set; }
        public Status Status { get; set; }
        public Address Address { get; set; }
    }
}
