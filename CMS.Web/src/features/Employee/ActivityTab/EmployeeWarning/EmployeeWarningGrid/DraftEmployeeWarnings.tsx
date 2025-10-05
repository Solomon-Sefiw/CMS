import { ApprovalStatus } from "../../../../../app/api/enums";
import { EmployeeWarningList } from "../EmployeeWarningList";

export const DraftEmployeeWarnings = () => (
  <EmployeeWarningList status={ApprovalStatus.Draft} />
);
