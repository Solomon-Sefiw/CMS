using CMS.Domain;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using CMS.Domain.Enum;

public class JobGradeStep
{
    
    public int Id { get; set; }
    public int JobGradeId { get; set; }
    public JobGrade JobGrade { get; set; }
    public int StepNumber { get; set; }
    public decimal SalaryAmount { get; set; }

   
}
