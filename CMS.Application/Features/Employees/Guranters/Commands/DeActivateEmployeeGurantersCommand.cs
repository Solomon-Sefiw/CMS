using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using MediatR;
using System.ComponentModel.DataAnnotations;



namespace CMS.Application.Features.Employees.Guranters.Commands
{
    public class DeActivateEmployeeGurantersCommand: IRequest<int>
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string? comment { get; set; }
        //
      

        //


    }
}
