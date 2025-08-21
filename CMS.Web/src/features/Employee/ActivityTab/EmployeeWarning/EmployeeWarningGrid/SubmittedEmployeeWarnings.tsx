import { ApprovalStatus } from "../../../../../app/api/enums";
import { EmployeeWarningList } from "../EmployeeWarningList";

export const SubmittedEmployeeWarnings = () => (
  <EmployeeWarningList status={ApprovalStatus.Submitted} />
);
