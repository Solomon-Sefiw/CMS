//using FluentValidation;
//using CMS.Domain.Enum;
//using CMS.Services.DataService;

//namespace CMS.Application
//{

//    public class RejectEmployeeApprovalRequestCommandValidator : AbstractValidator<RejectEmployeeApprovalRequestCommand>
//    {
//        private readonly IDataService dataService;

//        public RejectEmployeeApprovalRequestCommandValidator(IDataService dataService)
//        {
//            this.dataService = dataService;
//            RuleFor(p => p.Note).NotEmpty().WithMessage("Rejection comment is required.");
//            RuleFor(p => p)
//                .Must(Exist)
//                .WithMessage(x => $"Unable to find Employee.");
//            RuleFor(p => p)
//                .Must(ShouldHaveSubmittedForApprovalStatus)
//                .WithMessage(x => $"Cannot Reject a Employee that is not submitted for approval.");
//        }

//        private bool Exist(RejectEmployeeApprovalRequestCommand command)
//        {
//            return dataService.Employees.Any(s => s.Id == command.Id);
//        }

//        private bool ShouldHaveSubmittedForApprovalStatus(RejectEmployeeApprovalRequestCommand command)
//        {
//            return dataService.Employees.Any(s => s.Id == command.Id && s.ApprovalStatus == ApprovalStatus.Submitted);
//        }
//    }
//}
