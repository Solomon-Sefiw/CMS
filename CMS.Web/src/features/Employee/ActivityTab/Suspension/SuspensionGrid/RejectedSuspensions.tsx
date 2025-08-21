import { ApprovalStatus } from "../../../../../app/api/enums";
import { SuspensionList } from "../SuspensionList";

export const RejectedSuspensions = () => <SuspensionList status={ApprovalStatus.Rejected} />;