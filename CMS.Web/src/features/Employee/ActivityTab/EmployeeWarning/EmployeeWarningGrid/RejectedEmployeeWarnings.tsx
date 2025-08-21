import { ApprovalStatus } from "../../../../../app/api/enums";
import { EmployeeWarningList } from "../EmployeeWarningList";

export const RejectedEmployeeWarnings = () => (
  <EmployeeWarningList status={ApprovalStatus.Rejected} />
);
