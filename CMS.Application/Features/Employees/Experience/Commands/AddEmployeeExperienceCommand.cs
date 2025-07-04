using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using MediatR;
using System.ComponentModel.DataAnnotations;



namespace CMS.Application.Features.Employees.Experience.Commands
{
    public class AddEmployeeExperienceCommand: IRequest<int>
    {
        public int Id { get; set; }
        public string FirmName { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string JobTitle { get; set; }
        public string City { get; set; }
        public decimal LastSalary { get; set; }
        public string ReasonForResignation { get; set; }
        public int EmployeeId { get; set; }



    }
}
