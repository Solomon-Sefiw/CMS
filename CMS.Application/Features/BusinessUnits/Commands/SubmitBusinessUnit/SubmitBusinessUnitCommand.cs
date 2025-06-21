using MediatR;


namespace CMS.Application.Features.BusinessUnits.Commands.SubmitBusinessUnit
{
    public class SubmitBusinessUnitCommand:IRequest<int>
    {
        public int Id { get; set; }
    }
}
