using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Enum
{
//public enum BusinessUnitTypeEnum { Generic = 0, Court = 1, Department = 2, Branch = 3 }
//public enum BusinessUnitType { Unknown = 0, Woreda = 1, HighCourt = 2, SupremeCourt = 3 }
//public enum ApprovalStatus { Draft = 0, Submitted = 1, Approved = 2, Rejected = 3 }
//public enum Status { Active = 0, Inactive = 1 }
public enum CourtLevel { Woreda = 1, HighCourt = 2, SupremeCourt = 3 }
public enum ChilotType { Wonjel = 1, Fthabhier = 2, SiraKirkr = 3, Other = 99 }
public enum CaseType { Direct = 1, RTD = 2, Appeal = 3, Assigned = 4 }
public enum CaseStatus { Pending = 1, Submitted = 2, Verified = 3, Assigned = 4, Scheduled = 5, InHearing = 6, JudgmentDraft = 7, JudgmentPublished = 8, Rejected = 9, Closed = 10, Archived = 11 }
public enum CaseDocumentType { Petition = 1, Evidence = 2, Attachment = 3, Judgment = 4, Receipt = 5, Other = 99 }
public enum PaymentStatus { Pending = 1, Completed = 2, Failed = 3, Reversed = 4 }
public enum PaymentGatewayType { Telebirr, CBE, Awash, Dashen, Generic }
public enum HearingType { Preliminary = 1, Main = 2, Continuation = 3, Adjourned = 4, Virtual = 5 }
public enum NotificationChannel { InApp = 1, Email = 2, SMS = 3 }
public enum AppointmentStatus { Scheduled = 1, Confirmed = 2, Completed = 3, Cancelled = 4 }
}
