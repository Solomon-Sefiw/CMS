import { ApprovalStatus } from "../../../../../app/api/enums";
import { SuspensionList } from "../SuspensionList";

export const SubmittedSuspensions = () => <SuspensionList status={ApprovalStatus.Submitted} />;