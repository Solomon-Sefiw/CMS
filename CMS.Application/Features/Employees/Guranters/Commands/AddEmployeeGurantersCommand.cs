using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using MediatR;
using System.ComponentModel.DataAnnotations;



namespace CMS.Application.Features.Employees.Guranters.Commands
{
    public class AddEmployeeGurantersCommand: IRequest<int>
    {
        public int Id { get; set; }
        public string IdentificationCardNo { get; set; }
        public string Name { get; set; }
        public string FathersName { get; set; }
        public string GrandfathersName { get; set; }
        public string WorkingFirm { get; set; }

        public int EmployeeId { get; set; }
        //
        public string? Referenceno { get; set; }
        public decimal? Salary { get; set; }
        public ActivationEnum? Active { get; set; } 
        public DateOnly? FromDate { get; set; }
        public DateOnly? ToDate { get; set; }
        public Guarantee? GuaranteeType { get; set; }
        public string? comment { get; set; }
        //


    }
}
