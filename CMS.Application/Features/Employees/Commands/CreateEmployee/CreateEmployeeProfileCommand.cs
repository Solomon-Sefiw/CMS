using CMS.Domain.Enums;
using MediatR;
using System.ComponentModel.DataAnnotations;

namespace CMS.Application.Features.Employees
{
    public record CreateEmployeeProfileReturnType(int id,Guid versionNumber);
    public class CreateEmployeeProfileCommand:IRequest<CreateEmployeeProfileReturnType>
    {
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }

        public string AmharicFirstName { get; set; }
        public string? AmharicMiddleName { get; set; }
        public string? AmharicLastName { get; set; }
        public int BusinessUnitID { get; set; }
        public int JobId { get; set; }
        public DateOnly BirthDate { get; set; }
        public DateOnly EmployementDate { get; set; }
        public Gender Gender { get; set; }
        public MartialStatus MartialStatus { get; set; }
    }
}
