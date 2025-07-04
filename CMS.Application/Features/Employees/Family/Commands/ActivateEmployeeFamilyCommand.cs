using CMS.Domain.Employee;
using CMS.Domain.Enum;
using CMS.Domain.Enums;
using MediatR;
using System.ComponentModel.DataAnnotations;



namespace CMS.Application.Features.Employees.Family.Commands
{
    public class ActivateEmployeeFamilyCommand : IRequest<int>
    {
        public int Id { get; set; }
        public string? comment { get; set; }

    }
}
